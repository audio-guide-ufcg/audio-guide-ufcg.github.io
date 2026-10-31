import { recoveredPoints, demoPoints } from "@/lib/guide";
export function generateStaticParams() { return [...recoveredPoints, ...demoPoints].map(p => ({id: String(p.id)})); }
export const dynamicParams = false;
import { Suspense } from "react";
import Detail from "@/components/guide/Detail";
export default async function PointPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<p>Carregando lugar…</p>}>
      <Detail id={Number(id)} />
    </Suspense>
  );
}
