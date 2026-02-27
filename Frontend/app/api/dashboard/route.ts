import { NextResponse } from "next/server";

export async function GET() {
    // Simulate fetching data from a real internet source or database
    // by calculating slight randomized variations on a base template.

    const baseTotalHouseholds = 1250;
    // A random variation of +/- 50 to look "live"
    const randomVariation = Math.floor(Math.random() * 100) - 50;
    const totalHouseholds = baseTotalHouseholds + randomVariation;

    const data = {
        areaStats: {
            totalHouseholds: totalHouseholds,
            // Approximately 94% trained
            trainedHouseholds: Math.floor(totalHouseholds * 0.94) + Math.floor(Math.random() * 10) - 5,
            // Random compliance between 90-98%
            segregationCompliance: 90 + Math.floor(Math.random() * 9),
            // Random waste collected between 2.5 - 3.5
            wasteCollected: (2.5 + Math.random()).toFixed(1),
            // Random recycling rate between 70-85%
            recyclingRate: 70 + Math.floor(Math.random() * 15),
        },
        recentAlerts: [
            {
                id: 1,
                type: "warning",
                message: "Non-segregated waste detected at Block A, Building 12",
                time: `${Math.floor(Math.random() * 5) + 1} hours ago`, // Randomizer
                status: "pending",
            },
            {
                id: 2,
                type: "success",
                message: "100% compliance achieved in Sector 7 this week",
                time: "1 day ago",
                status: "resolved",
            },
            {
                id: 3,
                type: "info",
                message: "New composting facility operational in Zone 3",
                time: "2 days ago",
                status: "info",
            },
        ],
        wasteCollectionData: [
            {
                area: "Sector 1",
                households: 180 + Math.floor(Math.random() * 10),
                compliance: 90 + Math.floor(Math.random() * 10),
                collected: (0.4 + Math.random() * 0.2).toFixed(2),
                issues: Math.floor(Math.random() * 4),
            },
            {
                area: "Sector 2",
                households: 220 + Math.floor(Math.random() * 10),
                compliance: 85 + Math.floor(Math.random() * 10),
                collected: (0.45 + Math.random() * 0.2).toFixed(2),
                issues: Math.floor(Math.random() * 6),
            },
            {
                area: "Sector 3",
                households: 195,
                compliance: 95 + Math.floor(Math.random() * 5),
                collected: (0.35 + Math.random() * 0.2).toFixed(2),
                issues: Math.floor(Math.random() * 3),
            },
            {
                area: "Sector 4",
                households: 165,
                compliance: 88 + Math.floor(Math.random() * 10),
                collected: (0.3 + Math.random() * 0.2).toFixed(2),
                issues: Math.floor(Math.random() * 5),
            },
            {
                area: "Sector 5",
                households: 210,
                compliance: 92 + Math.floor(Math.random() * 6),
                collected: (0.4 + Math.random() * 0.2).toFixed(2),
                issues: Math.floor(Math.random() * 4),
            },
            {
                area: "Sector 6",
                households: 280,
                compliance: 89 + Math.floor(Math.random() * 10),
                collected: (0.5 + Math.random() * 0.2).toFixed(2),
                issues: Math.floor(Math.random() * 6),
            },
        ],
    };

    return NextResponse.json(data);
}
