import SideBar from "./component/layout/SideBar";
import { Window } from "./component/body/Window";
import { useState } from "react";

export default function App() {
  const [browse, setBrowse] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 p-3">
      <SideBar browse={browse} setBrowse={setBrowse} />
      <Window browse={browse} setBrowse={setBrowse}/>
    </div>
  );
}