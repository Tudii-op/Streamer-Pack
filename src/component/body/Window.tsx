import { useEffect, useState } from "react";
import { Suspense } from "react";

type Props = {
  choosenPackage: string | null;
};

export function Window({ choosenPackage }: Props) {
const [Component, setComponent] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    if (choosenPackage) {
      import(`../packages/${choosenPackage}/index.tsx`).then((module) => {
    setComponent(() => module.default);
  });
    }},[choosenPackage]);

return (
      <div>
        {choosenPackage ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Component />
          </Suspense>
        ) : null}
      </div>
    )
}