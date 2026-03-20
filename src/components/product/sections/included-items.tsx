export default function IncludedItems({ includedItems }: { includedItems: Record<string, string>[] }) {
  return (
    <section className="mx-auto flex max-w-7xl px-6 py-16 md:py-24 items-start justify-start w-full">
      <h2 className="text-start text-4xl font-medium font-loud mb-4 max-w-xl">Included items</h2>
      <div className="flex flex-col w-full rounded-4xl bg-muted overflow-hidden border border-border">
        <ul className="list-disc list-inside">
          {includedItems.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}