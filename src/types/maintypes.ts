export type SideBarProps = {
  browse: boolean;
  setBrowse: (value: boolean) => void;
};

export type Package = {
  id: string;
  name: string;
  description: string;
  downloadUrl: string;
};