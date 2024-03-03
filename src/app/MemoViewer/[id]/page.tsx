const MemoViewerIndividualPage = ({ params }: { params: { id: string } }) => {
  const slug = params.id;
  return (
    <div className="flex justify-center pt-6 text-gray">
      {slug}: ＜＜＜ここにメモを表示させたい＞＞＞:
    </div>
  );
};

export default MemoViewerIndividualPage;
