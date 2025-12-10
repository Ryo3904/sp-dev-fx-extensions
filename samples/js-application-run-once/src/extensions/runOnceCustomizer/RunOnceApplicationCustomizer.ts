
// src/extensions/autoReload/AutoReloadApplicationCustomizer.ts
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IProps {
  listTitle: string;      // 対象リストの表示名
  intervalMs?: number;    // 監視間隔（既定 3000ms）
}

export default class AutoReloadApplicationCustomizer
  extends BaseApplicationCustomizer<IProps> {

  private timer?: number;
  private last?: string;

  public async onInit(): Promise<void> {
    const interval = this.properties.intervalMs ?? 3000;
    await this.check();
    this.timer = window.setInterval(() => this.check(), interval);
    return Promise.resolve();
  }

  private async check(): Promise<void> {
    const list = this.properties.listTitle;
    if (!list) return;

    const url =
      `${this.context.pageContext.web.absoluteUrl}` +
      `/_api/web/lists/getByTitle('${encodeURIComponent(list)}')?` +
      `?$select=LastItemUserModifiedDate`;

    const res: SPHttpClientResponse =
      await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1,
        { headers: [['accept', 'application/json;odata=nometadata']] });

    if (!res.ok) return;
    const data = await res.json();
    const current: string | undefined = data?.LastItemUserModifiedDate;

    // 差分検知でリロード（タブが前面のときだけ）
    if (current && this.last && current !== this.last) {
      if (document.visibilityState === 'visible') location.reload();
    }
    if (current) this.last = current;
  }

  public onDispose(): void {
    if (this.timer) window.clearInterval(this.timer);
  }
