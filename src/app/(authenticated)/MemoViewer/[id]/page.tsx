const MemoViewerIndividualPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="flex justify-center pt-6 text-gray">
      {id}: ・懶ｼ懶ｼ懊％縺薙↓繝｡繝｢繧定｡ｨ遉ｺ縺輔○縺溘＞・橸ｼ橸ｼ・
    </div>
  );
};

export default MemoViewerIndividualPage;
