import { useEffect, useState } from "react";
import { Suspense } from "react";

type Props = {
  choosenPackage: string | null;
};

export function Window({ choosenPackage }: Props) {
const [Component, setComponent] = useState<React.ComponentType | null>(null);
useEffect(() => {
  setComponent(null);
  if (!choosenPackage) return;
  let active = true;
  import(`/installed/${choosenPackage}/App.js`)
    .then((mod) => {
      if (active) setComponent(() => mod.default);
    })
    .catch(console.error);
  return () => {
    active = false;
  };
}, [choosenPackage]);
  if (!choosenPackage) return null;
  if (!Component) return <div>Loading package...</div>;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}