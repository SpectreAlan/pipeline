import {
    CheckCircleFilled,
    ClockCircleFilled,
    CloseCircleFilled,
    LoadingOutlined,
} from "@ant-design/icons";
import React from "react";
const icons = {
    0: { icon: ClockCircleFilled, color: "#DBDBDB" },
    1: { icon: LoadingOutlined, color: "#87D2FF" },
    2: { icon: CheckCircleFilled, color: "#64D16D" },
    3: { icon: CloseCircleFilled, color: "#F87872" },
    7: { icon: CloseCircleFilled, color: "#F87872" },
    8: { icon: CheckCircleFilled, color: "#64D16D" },
    9: { icon: CloseCircleFilled, color: "#F87872" },
    10: { icon: CloseCircleFilled, color: "#F87872" },
};
export const getIcon = (status: number): React.ReactElement => {
    // @ts-ignore
    const { icon, color } = icons[String(status)];
    return React.createElement(icon, {
        style: { fontSize: "16px", color },
    });
};
