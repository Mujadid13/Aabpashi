// hooks/useFieldMapping.ts
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const useFieldMapping = () => {

  const tSidebar = useTranslations("sidebar");
  const placeholderMessage = tSidebar("placeholderMessage");
  // ✅ Popups visibility state
  const [showFieldsPopup, setShowFieldsPopup] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [showWaterReleasePopup, setShowWaterReleasePopup] = useState(false);
  const [showCanalSearchPopup, setShowCanalSearchPopup] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  // ✅ User selection state
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedSearchOption, setSelectedSearchOption] = useState<
    string | null
  >(null);
  const [selectedCanalSearch, setSelectedCanalSearch] = useState<string | null>(
    null
  );
  const [selectedWaterReleaseCanal, setSelectedWaterReleaseCanal] = useState<
    string | null
  >(null);
  const [selectedField, setSelectedField] = useState<any | null>(null);

  // ✅ User interaction state
  const [canalSearchQuery, setCanalSearchQuery] = useState("");
  const [chatbotMessage, setChatbotMessage] = useState(placeholderMessage);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // ✅ Location & accuracy state
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // ✅ API response state
  const [nearestCanals, setNearestCanals] = useState<string[]>([]);
  const [canalList, setCanalList] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingCanals, setIsFetchingCanals] = useState(false);
  const [isCanalDataFetched, setIsCanalDataFetched] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    fieldId: string | null;
    fieldName: string;
  }>({
    show: false,
    fieldId: null,
    fieldName: "",
  });

  const [drawPolygonMode, setDrawPolygonMode] = useState(false);
  const [AutdrawPolygonMode,setAutDrawPolygonMode] = useState(false);

  return {
    showFieldsPopup,
    setShowFieldsPopup,
    showSearchPopup,
    setShowSearchPopup,
    showWaterReleasePopup,
    setShowWaterReleasePopup,
    showCanalSearchPopup,
    setShowCanalSearchPopup,
    showComplaintModal,
    setShowComplaintModal,
    selectedFeature,
    setSelectedFeature,
    selectedSearchOption,
    setSelectedSearchOption,
    selectedCanalSearch,
    setSelectedCanalSearch,
    selectedWaterReleaseCanal,
    setSelectedWaterReleaseCanal,
    selectedField,
    setSelectedField,
    canalSearchQuery,
    setCanalSearchQuery,
    chatbotMessage,
    setChatbotMessage,
    isAudioPlaying,
    setIsAudioPlaying,
    position,
    setPosition,
    accuracy,
    setAccuracy,
    nearestCanals,
    setNearestCanals,
    canalList,
    setCanalList,
    fetchError,
    setFetchError,
    isFetching,
    setIsFetching,
    isFetchingCanals,
    setIsFetchingCanals,
    isCanalDataFetched,
    setIsCanalDataFetched,
    confirmDelete, 
    setConfirmDelete,
    drawPolygonMode, 
    setDrawPolygonMode,
    AutdrawPolygonMode,
    setAutDrawPolygonMode
  };
};

export default useFieldMapping;
