import Link from "next/link";

export default function Home() {
  return (
    <div style={{textAlign:"center",padding:"100px"}}>
      <h1>ResumePro 🚀</h1>
      <Link href="/builder">
        <button>Start</button>
      </Link>
    </div>
  );
}