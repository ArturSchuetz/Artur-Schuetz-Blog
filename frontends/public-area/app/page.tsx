import Home from "@/app/home/[currentPage]/page";

export default function Page({ params }: { params: { currentPage: number } }) {
  return <Home params={params}></Home>;
}
