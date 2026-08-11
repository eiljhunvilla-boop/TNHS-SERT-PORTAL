import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import logo from "../../../assets/images/sert-logo.jpg";
import { calculateAge } from "../../../utils/calculateAge";

export default function MemberIDCard({ member }) {
  const cardRef = useRef(null);

  if (!member) return null;

  const rank =
    member.bls &&
    member.trauma &&
    member.carriesTransportation
      ? "Senior"
      : "Neophyte";

  const age = calculateAge(member.birthdate);

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const formattedBirthdate = member.birthdate
    ? new Date(
        member.birthdate + "T00:00:00"
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  async function downloadPNG() {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 4,
      backgroundColor: null,
      useCORS: true,
      logging: false,
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
      logging: false,
    });

    const image = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [86, 110],
    });

    pdf.addImage(
      image,
      "PNG",
      0,
      0,
      86,
      110
    );

    pdf.save(`${member.sertId}.pdf`);
  }

  return (
    <div className="flex w-full flex-col items-center">

      {/* =========================
          CARD CONTAINER
      ========================= */}

      <div className="w-full overflow-x-auto pb-4">

        <div className="flex min-w-max justify-center px-2">

          {/* =========================
              DIGITAL ID CARD
          ========================= */}

          <div
            ref={cardRef}
            id="member-id-card"
            className="w-[360px] overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#0B1527] via-[#132340] to-[#1A2F54] shadow-2xl"
          >

            {/* =========================
                HEADER
            ========================= */}

            <div className="flex items-center gap-4 border-b border-white/10 p-5">

              <img
                src={logo}
                alt="SERT"
                className="h-16 w-16 shrink-0 rounded-full border-2 border-white object-cover"
              />

              <div className="min-w-0">

                <h2 className="text-xl font-bold text-white">
                  TNHS SERT
                </h2>

                <p className="text-sm text-blue-200">
                  School Emergency Response Team
                </p>

              </div>

            </div>


            {/* =========================
                MEMBER
            ========================= */}

            <div className="flex flex-col items-center p-8">

              {member.photo ? (

                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-28 w-28 shrink-0 rounded-full border-4 border-blue-500 object-cover"
                />

              ) : (

                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
                  {initials}
                </div>

              )}

              <h2 className="mt-5 max-w-full break-words px-2 text-center text-2xl font-bold text-white">
                {member.name}
              </h2>

              <p className="mt-2 text-blue-300">
                {member.sertId}
              </p>

              <span
                className={`mt-4 rounded-full px-5 py-2 font-semibold ${
                  rank === "Senior"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {rank}
              </span>

            </div>


            {/* =========================
                MEMBER DETAILS
            ========================= */}

            <div className="border-t border-white/10 px-6 py-5">

              <div className="grid grid-cols-2 gap-4">

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    BIRTHDATE
                  </p>

                  <p className="break-words font-semibold text-white">
                    {formattedBirthdate}
                  </p>
                </div>


                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    AGE
                  </p>

                  <p className="font-semibold text-white">
                    {age !== ""
                      ? `${age} years old`
                      : "N/A"}
                  </p>
                </div>


                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    STATUS
                  </p>

                  <p
                    className={`font-semibold ${
                      member.status === "Active"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {member.status}
                  </p>
                </div>


                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    MEMBER ID
                  </p>

                  <p className="break-words font-semibold text-blue-300">
                    {member.sertId}
                  </p>
                </div>

              </div>


              {/* CONTACT */}

              <div className="mt-5 min-w-0">

                <p className="text-xs text-gray-400">
                  CONTACT NUMBER
                </p>

                <p className="break-words font-semibold text-white">
                  {member.contactNumber || "Not provided"}
                </p>

              </div>


              {/* ADDRESS */}

              <div className="mt-4 min-w-0">

                <p className="text-xs text-gray-400">
                  ADDRESS
                </p>

                <p className="break-words font-semibold leading-relaxed text-white">
                  {member.address || "Not provided"}
                </p>

              </div>

            </div>


            {/* =========================
                QR CODE
            ========================= */}

            <div className="border-t border-white/10 p-6">

              <div className="flex flex-col items-center">

                <div className="rounded-lg bg-white p-2">

                  <QRCode
                    value={`SERT ID: ${member.sertId}
NAME: ${member.name}
RANK: ${rank}
BIRTHDATE: ${member.birthdate || "N/A"}
AGE: ${age !== "" ? age : "N/A"}
STATUS: ${member.status}
CONTACT: ${member.contactNumber || "N/A"}
ADDRESS: ${member.address || "N/A"}`}
                    size={95}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />

                </div>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Scan for member information
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          BUTTONS
      ========================= */}

      <div className="mt-4 grid w-full gap-3">

        <button
          onClick={() => window.print()}
          className="rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          🖨 Print ID Card
        </button>

      </div>

    </div>
  );
}