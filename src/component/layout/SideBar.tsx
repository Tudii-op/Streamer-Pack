
type Props = {
  setChoosenPackage: (id: string) => void;
};

export default function SideBar({
  setChoosenPackage,
}: Props) {

  return (
    <div className="w-64 border border-zinc-800 rounded-lg p-4 bg-zinc-900">
      <button onClick={() => setChoosenPackage("video")} >Video Capure</button>
      <button onClick={() => setChoosenPackage("audio")} >Audio Capure</button>
    </div>
  );
}