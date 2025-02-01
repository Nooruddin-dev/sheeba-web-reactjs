
import React from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { RootState } from "../../../../globalStore/rootReducer";

export default function SiteLoader() {
    const isLoading = useSelector((state: RootState) => state.loader.isLoading);

    return (
        <>
        {isLoading && (
          <div className="sheeba-loader-overlay">
        <div className="sheeba-loader"></div>
          </div>
        )}
      </>
    );
}
