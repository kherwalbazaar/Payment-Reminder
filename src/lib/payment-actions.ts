export function generatePaymentImage(amount: number, mobile: string): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 800, 800);

    // PAYMENT header
    ctx.fillStyle = "#1E3A5F";
    ctx.font = "bold 64px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAYMENT", 400, 90);

    // Gold line
    ctx.strokeStyle = "#C5A55A";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 115);
    ctx.lineTo(700, 115);
    ctx.stroke();

    // Shopping bag icon (simple)
    ctx.fillStyle = "#1E3A5F";
    ctx.beginPath();
    ctx.moveTo(360, 170);
    ctx.lineTo(340, 250);
    ctx.lineTo(460, 250);
    ctx.lineTo(440, 170);
    ctx.closePath();
    ctx.fill();

    // Leaves
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.ellipse(380, 155, 20, 35, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(420, 155, 20, 35, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // KHERWAL BAZAAR text
    ctx.fillStyle = "#1E3A5F";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("KHERWAL", 400, 310);
    ctx.fillStyle = "#C5A55A";
    ctx.font = "bold 56px Arial";
    ctx.fillText("BAZAAR", 400, 370);

    // Tagline
    ctx.fillStyle = "#4CAF50";
    ctx.font = "22px Arial";
    ctx.fillText("Your Shopping Destination", 400, 405);

    // MOB section
    ctx.fillStyle = "#1E3A5F";
    ctx.fillRect(0, 430, 800, 80);
    ctx.fillStyle = "#C5A55A";
    ctx.font = "bold 44px Arial";
    ctx.fillText(`MOB: ${mobile}`, 400, 482);

    // Rupee symbol and amount
    ctx.fillStyle = "#1B5E20";
    ctx.font = "bold 140px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`₹${amount.toLocaleString("en-IN")}`, 400, 650);

    // Clock icon (simple circle)
    ctx.strokeStyle = "#1B5E20";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(720, 600, 35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(720, 600);
    ctx.lineTo(720, 580);
    ctx.moveTo(720, 600);
    ctx.lineTo(735, 610);
    ctx.stroke();

    // DUE AMOUNT text
    ctx.fillStyle = "#1B5E20";
    ctx.font = "bold 48px Arial";
    ctx.fillText("DUE AMOUNT", 400, 720);

    canvas.toBlob((blob) => {
      resolve(blob!);
    }, "image/png");
  });
}

export async function shareWhatsAppImage(amount: number, mobile: string) {
  const blob = await generatePaymentImage(amount, mobile);
  const file = new File([blob], "payment-reminder.png", { type: "image/png" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        text: `Hi! Your pending dues of ₹${amount.toLocaleString("en-IN")} from Kherwal Bazaar is awaiting payment. Kindly clear it at the earliest. Thank you!`,
      });
      return;
    } catch {
      // fallback
    }
  }

  // Fallback: download image + open WhatsApp text
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "payment-reminder.png";
  a.click();
  URL.revokeObjectURL(url);
  window.open(`https://wa.me/91${mobile}`, "_blank");
}

export function sendSms(amount: number, mobile: string, name: string, days: number) {
  const text = `Hi ${name}, this is a reminder from Kherwal Bazaar. You have a pending dues of ₹${amount.toLocaleString("en-IN")} (${days} days overdue). Kindly clear it at the earliest. Thank you!`;
  window.open(`sms:${mobile}?body=${encodeURIComponent(text)}`, "_self");
}
