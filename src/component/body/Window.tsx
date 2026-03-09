type Content = React.ReactNode;

export function Window({ content }: { content?: Content }) {
  if (!content) {
    return (
      <div className="flex flex-col justify-center text-center">
        <h1>Empty tale</h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit aliquam
          dignissimos explicabo! Voluptas illum pariatur tempora repellendus
          consequuntur voluptate.
        </p>
      </div>
    );
  }

  return <>{content}</>;
}