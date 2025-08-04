import React from "react";
import complaints from "@/data/complaints";
import { Mail, Phone, MapPin, Globe, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ComplaintModalProps {
  setShowComplaintModal: (state: boolean) => void;
  showComplaintModal: boolean;
}

const ComplaintModal: React.FC<ComplaintModalProps> = ({
  setShowComplaintModal,
  showComplaintModal,
}) => {
  const t = useTranslations("complaints");

  if (!showComplaintModal) return null;

  return (
    <div className="complaint-modal-overlay">
      <div className="complaint-modal-container">
        <button
          onClick={() => setShowComplaintModal(false)}
          className="close-button"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="modal-title">{t("title")}</h2>

        {complaints.map((complaint, index) => (
          <div key={index} className="complaint-item space-y-2">
            <h3 className="complaint-name">
              {t(`names.${complaint.nameKey}`)}
            </h3>

            {complaint.email && (
              <p>
                <Mail size={18} className="inline mr-2" />
                <a href={`mailto:${complaint.email}`} className="complaint-link">
                  {complaint.email}
                </a>
              </p>
            )}

            {complaint.whatsapp && (
              <p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  className="inline mr-2"
                >
                  <path d="M16 .396c-8.837 0-16 7.163-16 16 0 2.813.729 5.45 2.1 7.823L.26 31.74l7.635-1.997C10.145 31.121 13.03 32 16 32c8.837 0 16-7.163 16-16S24.837.396 16 .396zm0 29.571c-2.69 0-5.29-.73-7.564-2.11l-.541-.32-4.532 1.185 1.21-4.419-.353-.573a13.366 13.366 0 0 1-2.053-7.094c0-7.422 6.036-13.457 13.457-13.457S29.457 7.978 29.457 15.4 23.421 29.967 16 29.967zm7.566-10.284c-.418-.209-2.477-1.223-2.861-1.36-.384-.14-.665-.209-.947.209s-1.084 1.36-1.33 1.638c-.243.279-.487.314-.905.105-.418-.209-1.767-.649-3.368-2.07-1.244-1.109-2.08-2.48-2.324-2.9-.243-.419-.026-.646.183-.854.187-.185.418-.487.627-.73.21-.244.279-.419.418-.698.14-.279.07-.524-.035-.732-.105-.21-.947-2.27-1.297-3.104-.34-.81-.687-.7-.947-.7-.243-.012-.522-.014-.802-.014s-.732.105-1.117.524c-.384.419-1.461 1.426-1.461 3.479s1.495 4.038 1.701 4.318c.209.279 2.942 4.491 7.128 6.293 4.186 1.802 4.186 1.197 4.938 1.118.752-.07 2.477-1.009 2.829-1.98.35-.97.35-1.802.243-1.98-.105-.183-.383-.279-.8-.488z" />
                </svg>
                <a
                  href={`https://wa.me/${complaint.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="complaint-link"
                >
                  {complaint.whatsapp}
                </a>
              </p>
            )}

            {complaint.tollFree && (
              <p>
                <Phone size={18} className="inline mr-2" />
                <a href={`tel:${complaint.tollFree}`} className="complaint-link">
                  {complaint.tollFree}
                </a>
              </p>
            )}

            {complaint.postalAddress && (
              <p>
                <MapPin size={18} className="inline mr-2" />
                {complaint.postalAddress}
              </p>
            )}

            {complaint.website && (
              <>
                <p>
                  <Globe size={18} className="inline mr-2" />
                  <a
                    href={complaint.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="complaint-link"
                  >
                    {complaint.website}
                  </a>
                </p>
                <button
                  onClick={() =>
                    window.open(
                      complaint.website,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="visit-button"
                >
                  {t("visitWebsite", {
                    name: t(`names.${complaint.nameKey}`),
                  })}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintModal;
