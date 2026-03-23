import CodeEditor from "@/components/Editor";
import VideoCall from "@/components/VideoCall";

export default function Room({ params }: any) {
  return (
    <div className="flex gap-4 p-4">
      <CodeEditor roomId={params.id} />
      <VideoCall />
    </div>
  );
}