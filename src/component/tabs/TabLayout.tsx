type Props = {
  children: React.ReactNode;
};

export default function TabLayout({
  children
}: Props) {
  return (
    <div>
      {children}
    </div>
  );
}