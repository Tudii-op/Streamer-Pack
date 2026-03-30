export type SideBarProps = {
  browse: boolean;
  setBrowse: (v: boolean) => void;
  choosenPackage: string | null;
};
export type Package = {
  id: string;
  name: string;
  description: string;
  downloadUrl: string;
};
export type InstalledPackage = {
  name: string;
};
export type UseInstalledReturn = {
  installed: InstalledPackage[];
  loading: boolean;
  refetch: () => void;
};
