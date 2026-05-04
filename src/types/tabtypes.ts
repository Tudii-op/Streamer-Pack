export type TabType = {
  id: string
  title: string
  type: 'plugin' | 'browser'
  Plugin: React.ComponentType | null
}
export type OpenedTab = {
  id: string;
  plugin: string | null;
};