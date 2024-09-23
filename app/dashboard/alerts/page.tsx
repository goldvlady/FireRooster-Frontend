"use client";
import { AlertPage } from "@/components/alert/AlertPage";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hooks";
import { alertService } from "@/services/alerts";
import { AlertObject } from "@/services/types/alert.type";
import { setPageInfo } from "@/store/slices/scanner.slice";
import { useStore } from "@/store/StoreProvider";
import { SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<AlertObject[]>([]);
  const pageInfo = useAppSelector((state) => state.scanner.pageInfo);
  const [page, setPage] = useState(pageInfo?.pageNo || 0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [headSearch, setHeadSearch] = useState("");
  const [decSearch, setDecSearch] = useState("");
  const { currentCategory, setCurrentCategory } = useStore();
  const [selectedFrom, setSelectedFrom] = useState<Date | null>(null);
  const [selectedTo, setSelectedTo] = useState<Date | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchAlertsData();
  }, [
    page,
    rowsPerPage,
    totalPages,
    headSearch,
    decSearch,
    currentCategory,
    selectedFrom,
    selectedTo,
  ]);

  const fetchAlertsData = async () => {
    const res = await alertService.getAllAlerts({
      limit: rowsPerPage,
      page: page + 1,
      headSearch,
      decSearch,
      category: String(currentCategory == "ALL" ? "" : currentCategory),
      selected_from: selectedFrom,
      selected_to: selectedTo,
    });
    setData(res.alerts);
    setTotalPages(res.pagination.total);
  };

  const handleInfoChange = (event: SelectChangeEvent) => {
    const fAlert = event.target.value;
    setCurrentCategory(fAlert);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(
      setPageInfo({ pageName: pageInfo?.pageName || "", pageNo: newPage })
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleHeadSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHeadSearch(value);
  };
  const handleDecSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDecSearch(value);
  };

  const handleDateChange = (
    event: unknown,
    type: "from" | "to",
    date: Date
  ) => {
    if (type === "from") setSelectedFrom(date);
    else setSelectedTo(date);
  };

  return (
    <>
      <AlertPage
        data={data}
        page={page}
        headSearch={headSearch}
        decSearch={decSearch}
        handleHeadSearchChange={handleHeadSearchChange}
        handleDecSearchChange={handleDecSearchChange}
        filterAlert={currentCategory}
        handleInfoChange={handleInfoChange}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        selectedFrom={selectedFrom}
        selectedTo={selectedTo}
        handleDateChange={handleDateChange}
      />
    </>
  );
}
