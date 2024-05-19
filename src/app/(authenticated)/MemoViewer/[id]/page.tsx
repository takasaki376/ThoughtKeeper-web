const MemoViewerIndividualPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex justify-center pt-6 text-gray">
      {params.id}: ＜＜＜ここにメモを表示させたい＞＞＞:
    </div>
  );
};

export default MemoViewerIndividualPage;
