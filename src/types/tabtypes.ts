export type TabType = {
  id: string
  title: string
  Plugin: React.ComponentType | null
}
export type OpenedTab = {
  id: string;
  plugin: string | null;
};