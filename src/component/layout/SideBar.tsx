import {SideBarProps} from "../../types/maintypes"
export default function SideBar({ browse, setBrowse }: SideBarProps) {
  return (
    <div className="border p-4">
      <button
        className="border cursor-pointer p-2"
        onClick={() => setBrowse(!browse)} // toggle state
      >
        Browse
      </button>
    </div>
  );
}