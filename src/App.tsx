import SideBar from "./component/layout/SideBar";
import { Window } from "./component/body/Window";
export default function App() {


  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 p-3">
      <SideBar/>
      <Window/>
    </div>
  );
}