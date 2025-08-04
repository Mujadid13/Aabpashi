"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SearchMethodPopup from "@/components/Popup/SearchMethodPopup";
import CanalSearchPopup from "@/components/Popup/CanalSearchPopup";
import WaterReleasePopup from "@/components/Popup/WaterReleasePopup";
import ComplaintModal from "@/components/Popup/ComplaintPopup";
import useFieldMapping from "@/hooks/useFieldMapping"; 
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import { useAuthForms } from "@/hooks/useAuthForms";

const MAPPage = dynamic(() => import("./MAPPage"), { ssr: false });

export default function FieldMapping() {
  const router = useRouter();
  const state = useFieldMapping();
  const {userId} = useAuthHandlers();
  const {division1} = useAuthForms();

  return (
    <div className="field-mapping-container">
      {/* Sidebar Section */}
      <div className="sidebar-container1">
        <Sidebar
          accuracy={state.accuracy}
          chatbotMessage={state.chatbotMessage}
          isAudioPlaying={state.isAudioPlaying}
          selectedFeature={state.selectedFeature}
          setSelectedFeature={state.setSelectedFeature}
          setShowFieldsPopup={state.setShowFieldsPopup}
          setShowComplaintModal={state.setShowComplaintModal}
          setShowSearchPopup={state.setShowSearchPopup}
          selectedField={state.selectedField}
          setChatbotMessage={state.setChatbotMessage}
          showSearchPopup={state.showSearchPopup}
          showComplaintModal={state.showComplaintModal}
          position={state.position}
          showFieldsPopup={state.showFieldsPopup}
          setDrawPolygonMode={state.setDrawPolygonMode}
          setAutDrawPolygonMode={state.setAutDrawPolygonMode}
        />
      </div>

      {/* Map Section */}
      <div className="map-container">
        <MAPPage
          showFieldsPopup={state.showFieldsPopup}
          setShowFieldsPopup={state.setShowFieldsPopup}
          selectedFeature={state.selectedFeature}
          setSelectedFeature={state.setSelectedFeature}
          position={state.position}
          setPosition={state.setPosition}
          accuracy={state.accuracy}
          setAccuracy={state.setAccuracy}
          selectedField={state.selectedField}
          setSelectedField={state.setSelectedField}
          userId={userId}
          division1={division1}
          confirmDelete={state.confirmDelete}
          setConfirmDelete={state.setConfirmDelete}
          setDrawPolygonMode={state.setDrawPolygonMode}
          drawPolygonMode={state.drawPolygonMode}
          setAutDrawPolygonMode={state.setAutDrawPolygonMode}
          AutdrawPolygonMode={state.AutdrawPolygonMode}
        />
      </div>

      <SearchMethodPopup
        showSearchPopup={state.showSearchPopup}
        setShowSearchPopup={state.setShowSearchPopup}
        setSelectedSearchOption={state.setSelectedSearchOption}
        selectedSearchOption={state.selectedSearchOption}
        selectedField={state.selectedField}
        setIsFetching={state.setIsFetching}
        setSelectedFeature={state.setSelectedFeature}
        setNearestCanals={state.setNearestCanals}
        setChatbotMessage={state.setChatbotMessage}
        setShowWaterReleasePopup={state.setShowWaterReleasePopup}
        position={state.position}
        setCanalList={state.setCanalList}
        isFetchingCanals={state.isFetchingCanals}
        setIsFetchingCanals={state.setIsFetchingCanals}
        setFetchError={state.setFetchError}
        isCanalDataFetched={state.isCanalDataFetched}
        setIsCanalDataFetched={state.setIsCanalDataFetched}
        setShowCanalSearchPopup={state.setShowCanalSearchPopup}
        division1={division1}
      />

      <CanalSearchPopup
        showCanalSearchPopup={state.showCanalSearchPopup}
        setShowCanalSearchPopup={state.setShowCanalSearchPopup}
        canalSearchQuery={state.canalSearchQuery}
        setCanalSearchQuery={state.setCanalSearchQuery}
        selectedCanalSearch={state.selectedCanalSearch}
        setSelectedCanalSearch={state.setSelectedCanalSearch}
        setSelectedSearchOption={state.setSelectedSearchOption}
        setSelectedFeature={state.setSelectedFeature}
        setShowSearchPopup={state.setShowSearchPopup}
        isFetchingCanals={state.isFetchingCanals}
        fetchError={state.fetchError}
        canalList={state.canalList}
        isFetching={state.isFetching}
        setIsFetching={state.setIsFetching}
        setChatbotMessage={state.setChatbotMessage}
        division1={division1}
      />

      <WaterReleasePopup
        showWaterReleasePopup={state.showWaterReleasePopup}
        setShowWaterReleasePopup={state.setShowWaterReleasePopup}
        selectedWaterReleaseCanal={state.selectedWaterReleaseCanal}
        setSelectedWaterReleaseCanal={state.setSelectedWaterReleaseCanal}
        setSelectedFeature={state.setSelectedFeature}
        setShowSearchPopup={state.setShowSearchPopup}
        nearestCanals={state.nearestCanals}
        isFetching={state.isFetching}
        setIsFetching={state.setIsFetching}
        setChatbotMessage={state.setChatbotMessage}
        division1={division1}
      />

      <ComplaintModal
        setShowComplaintModal={state.setShowComplaintModal}
        showComplaintModal={state.showComplaintModal}
      />
    </div>
  );
}
