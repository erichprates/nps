"use client";

import { useState, useMemo } from 'react';
import { NPSResponse } from "@/lib/types";
import DashboardStats from "./DashboardStats";
import ResponseList from "./ResponseList";
import ResponseDetailsModal from "./ResponseDetailsModal";

export default function DashboardContainer({ initialData }: { initialData: NPSResponse[] }) {
    return (
        <div>
            <DashboardStats
                data={initialData}
            />
        </div>
    );
}
