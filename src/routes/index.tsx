import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["value"],
      queryFn: testServerfn,
    });
  },
});

function Home() {
  const valueQuery = useSuspenseQuery({
    queryKey: ["value"],
    queryFn: testServerfn,
  });

  const queryClient = useQueryClient();

  return (
    <div>
      <p>Value: {valueQuery.data.value}</p>
      <button
        onClick={async () => {
          await queryClient.invalidateQueries({ queryKey: ["value"] });
        }}
        className="rounded-sm bg-blue-600 px-2 py-1 text-white"
      >
        Refetch
      </button>
    </div>
  );
}

const testServerfn = createServerFn().handler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { value: Math.random() };
});
