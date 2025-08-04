// components/ManualLoader.tsx
import Image from "next/image";

export default function ManualLoader() {
  return (
    <div className="manual-loader-overlay">
      <Image
        src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1746126580/logo-icon_tfghku.png"
        alt="Loading"
        width={80}
        height={80}
        className="manual-loader-icon"
      />
    </div>
  );
}
