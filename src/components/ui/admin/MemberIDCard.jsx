import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import logo from "../../../assets/images/sert-logo.jpg";

export default function MemberIDCard({ member }) {
  const cardRef = useRef(null);

  if (!member) return null;

  const rank =
    member.bls &&
    member.trauma &&
    member.carriesTransportation
      ? "Senior"
      : "Neophyte";

      

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

async function downloadPNG() {

  console.log(cardRef.current);

  if (!cardRef.current) return;

  const canvas = await html2canvas(cardRef.current, {
    scale: 4,
    backgroundColor: null,
    useCORS: true,
  });

  const link = document.createElement("a");

  link.download = `${member.sertId}.png`;

  link.href = canvas.toDataURL("image/png");

  link.click();

}

async function downloadPDF() {

  if (!cardRef.current) return;

  const canvas = await html2canvas(cardRef.current, {
    scale: 4,
    backgroundColor: null,
    useCORS: true,
  });

  const image = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [54, 86],
  });

  pdf.addImage(
    image,
    "PNG",
    0,
    0,
    86,
    54
  );

  pdf.save(`${member.sertId}.pdf`);

}

  return (
    <div className="flex flex-col items-center">

      {/* CARD */}

<div
  ref={cardRef}
  id="member-id-card"
  className="mx-auto w-[360px] rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#0B1527] via-[#132340] to-[#1A2F54] shadow-2xl"
>

        {/* Header */}

        <div className="flex items-center gap-4 border-b border-white/10 p-5">

          <img
            src={logo}
            alt="SERT"
            className="h-16 w-16 rounded-full border-2 border-white"
          />

          <div>

            <h2 className="text-xl font-bold text-white">
              TNHS SERT
            </h2>

            <p className="text-sm text-blue-200">
              School Emergency Response Team
            </p>

          </div>

        </div>

        {/* Body */}

        <div className="flex flex-col items-center p-8">

          {member.photo ? (

            <img
              src={member.photo}
              alt={member.name}
              className="h-28 w-28 rounded-full border-4 border-blue-500 object-cover"
            />

          ) : (

            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
              {initials}
            </div>

          )}

          <h2 className="mt-5 text-center text-2xl font-bold text-white">
            {member.name}
          </h2>

          <p className="mt-2 text-blue-300">
            {member.sertId}
          </p>

          <span
            className={`mt-4 rounded-full px-5 py-2 ${
              rank === "Senior"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {rank}
          </span>

        </div>

 {/* Footer */}

<div className="border-t border-white/10 p-6">

  <div className="flex items-center justify-between">

    <div className="space-y-3">

      <div>
        <p className="text-xs text-gray-400">STATUS</p>
        <p className="font-semibold text-white">
          {member.status}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400">MEMBER ID</p>
        <p className="font-semibold text-blue-300">
          {member.sertId}
        </p>
      </div>

    </div>

    <div className="rounded-lg bg-white p-2">
      
<QRCode
  value={`SERT ID: ${member.sertId}
NAME: ${member.name}
RANK: ${rank}
STATUS: ${member.status}`}
  size={95}
  level="H"
  bgColor="#ffffff"
  fgColor="#000000"
/>

    </div>

  </div>

</div>

      </div>

      {/* BUTTONS */}

{/* BUTTONS */}

<div className="mt-6 grid w-full gap-3">

  <button
    onClick={() => {
  console.log("PRINT CLICKED");
  window.print();
}}
    className="rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
  >
    🖨 Print ID Card
  </button>

</div>

    </div>
  );
}