import { Loader } from "@/component/Loader";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader size="xl" />
    </div>
  );
}
