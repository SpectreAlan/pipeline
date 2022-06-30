import { getIcon } from "./constant";
import { IconnectorNode, IHash, IHashNode, INode, IRes } from "./types";

export const transformData = (list: INode[], hash: IHashNode): IRes => {
    const res: IRes = {
        nodes: [],
        msg: "",
    };
    const start = list.find((item) => item.nodeType === "startEvent")!;
    start.level = 0;
    start.nodeName = "开始";
    hash[start.nodeId] = start;
    try {
        getChildren([start], list, hash, 1, res);
    } catch (e) {
        console.log(e);
    }
    if (res.msg) {
        return res;
    }
    const nodes: INode[] = Array.from(Object.values(hash));
    const end: INode = nodes.find((item) => item.nodeType === "endEvent")!;
    const level: number = end.level!;
    for (let i = 0; i < level + 1; i++) {
        res.nodes[i] = nodes.filter((item) => item.level === i);
    }
    return res;
};

const getChildren = (
    nodes: INode[],
    list: INode[],
    hash: IHash,
    level: number,
    res: IRes,
) => {
    const len = nodes.length;
    for (let k = 0; k < len; k++) {
        const node: INode = nodes[k];
        node.nodeName = getName(node.nodeName || "", node.nodeType);
        node.total = nodes.length;
        const lines: IconnectorNode[] = node.connectorNodeList.next || [];
        if (lines.length) {
            const children: INode[] = [];
            const length: number = lines.length;
            for (let i = 0; i < length; i++) {
                const line: INode = list.find(
                    (l) => l.nodeId === lines[i].nodeId,
                )!;
                if (!line.connectorNodeList.next.length) {
                    res.msg = "节点异常:" + lines[i].nodeId;
                    return;
                }
                const node: INode = list.find(
                    (i) => i.nodeId === line.connectorNodeList.next[0].nodeId,
                )!;
                if (!hash[node.nodeId]) {
                    hash[node.nodeId] = node;
                    children.push(node);
                    node.level = level;
                } else {
                    if (level > node.level!) {
                        for (let n = level - 1; n > node.level! - 1; n--) {
                            hash["empty" + i + k + n] = {
                                empty: true,
                                level: n,
                            };
                        }
                        node.level = level;
                        getChildren([node], list, hash, level + 1, res);
                    } else {
                        for (let n = node.level! - 1; n > level; n--) {
                            hash["empty" + i + k + n] = {
                                empty: true,
                                level: n,
                            };
                        }
                    }
                }
            }
            if (children.length) {
                getChildren(children, list, hash, level + 1, res);
            }
        }
    }
};

export const getNodePosition = (nodes: INode[][]): number => {
    let x: number = 20;
    for (let i = 0; i < nodes.length; i++) {
        const levels: INode[] = nodes[i];
        const len = levels.length;
        let maxWidth = 0;
        let emptyCount = 0;
        for (let j = 0; j < len; j++) {
            const { nodeName, nodeType, empty } = levels[j];
            if (empty) {
                emptyCount++;
                continue;
            }
            const y = 200 + (j - len / 2) * 60;
            let extra = 0;
            if (
                nodeType === '0' ||
                nodeType === '1'
            ) {
                const status = levels[j].taskData?.taskStatus || 0;
                levels[j].status = status;
                levels[j].icon = getIcon(status);
                let cursor = "pointer";
                if (status === 0) {
                    cursor = "not-allowed";
                }
                if (nodeType === "1") {
                    cursor = status === 1 ? "pointer" : "not-allowed";
                }
                levels[j].cursor = cursor;
                extra = 20;
            }
            const w = getStringWidth(nodeName) + 30 + extra;
            maxWidth = w > maxWidth ? w : maxWidth;
            levels[j].x = x;
            levels[j].y = y;
            levels[j].w = w;
        }
        if (len - emptyCount === 1) {
            levels.find((item) => !item.empty)!.y = 170;
        }
        x += maxWidth + 60;
    }
    return x;
};
export const drawLine = (nodes: INode[], list: INode[]): string[] => {
    let lines: string[] = [];
    for (let k = 0; k < nodes.length; k++) {
        const { nodeId, connectorNodeList, empty } = nodes[k];
        if (empty) {
            continue;
        }
        const next = connectorNodeList.next || [];
        for (let i = 0; i < next.length; i++) {
            const { x: x1, y: y1 } = getLinePosition(nodeId, true, list);
            const line: INode = list.find(
                (item) => item.nodeId === next[i].nodeId,
            )!;
            const nextNodeId: string = line?.connectorNodeList?.next[0]?.nodeId;
            if(!nextNodeId){continue}
            const { x: x2, y: y2 } = getLinePosition(nextNodeId, false, list);
            if (y1 === y2) {
                lines.push(`M ${x1},${y1} ${x2},${y2}`);
                continue;
            }
            const firstLine = x2 - x1 > 48 ? x2 - x1 - 20 : 20;
            if (y2 > y1) {
                lines.push(` M ${x1},${y1} ${x1 + firstLine}, ${y1}L ${ x1 + firstLine },${y1}Q ${x1 + firstLine + 5},${y1} ${x1 + firstLine + 5},${ y1 + 5 }L
                 ${x1 + firstLine + 5},${y2 - 5}L ${x1 + firstLine + 5},${ y2 - 5 }Q ${x1 + firstLine + 5},${y2} ${ x1 + firstLine + 10 },${y2}L ${x2},${y2}
                 `);
            } else {
                // 上
                lines.push(` M ${x1},${y1} ${x1 + firstLine},${y1}L ${ x1 + firstLine },${y1}Q ${x1 + firstLine + 5},${y1} ${x1 + firstLine + 5},${ y1 - 5
                }L ${x1 + firstLine + 5},${y2 + 5}L ${x1 + firstLine + 5},${ y2 + 5 }Q ${x1 + firstLine + 5},${y2} ${ x1 + firstLine + 10 },${y2}L ${x2},${y2}
                `);
            }
        }
    }
    return lines;
};
const getStringWidth = (str: string): number => {
    let d = document.createElement("text");
    d.innerText = str;
    d.style.fontSize = "12px";
    d.style.visibility = "hidden";
    document.body.appendChild(d);
    let len = d.offsetWidth;
    document.body.removeChild(d);
    return len;
};

const getLinePosition = (
    nodeId: string,
    start: boolean,
    list: INode[],
): { x: number; y: number } => {
    const node: INode = list.find((item) => item.nodeId === nodeId)!;
    const { x, y, w } = node;
    return { x: x + (start ? w + 12 : 0), y: y + 15 };
};

const getName = (nodeName: string, nodeType: string): string => {
    if (nodeName) {
        return nodeName;
    }
    return nodeType === "startEvent"
        ? "开始"
        : nodeType === "endEvent"
        ? "结束"
        : "手动触发";
};
