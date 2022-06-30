import React, { useEffect, useState} from "react";
import { drawLine, getNodePosition, transformData } from "./common";
// @ts-ignore
import style from "./style.less";
import { IHashNode, INode,IProps } from "./types";

const PipeLine: React.FC<IProps> = ({list}) => {
    const [width, setWidth] = useState<number>(400);
    const [hash, setHash] = useState<IHashNode>({});
    const [lines, setLines] = useState<string[]>([]);
    const [pipeLines, setPipeLines] = useState<INode[]>([]);
    useEffect(() => {
        renderPipeline();
    }, [list]);
    const renderPipeline = () => {
        setHash({});
        if(!list.length){return}
        const { nodes, msg } = transformData(list, hash);
        if (!msg) {
            setWidth(getNodePosition(nodes));
            const textNodes: INode[] = nodes.flat();
            setPipeLines(textNodes);
            setLines(drawLine(textNodes, list));
        } else {
            // do something
        }
    };
    const handleScroll = (e:any) => {
        const delta = Math.max(
            -1,
            Math.min(1, e.nativeEvent.wheelDelta || -e.nativeEvent.detail),
        );
        e.currentTarget.scrollLeft -= delta * 30;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        e.preventDefault
    };
    return (
        <div
            className={style["pipeLine-detail"]}
            onWheel={(e) => handleScroll(e)}
        >
            <ul className={style.nodes} style={{ width }}>
                {pipeLines.map(
                    (node) =>
                        !node.empty && (
                            <li
                                onClick={() =>{} }
                                className={style.node}
                                key={node.nodeId}
                                style={{
                                    top: node.y,
                                    left: node.x,
                                    cursor: node.cursor,
                                }}
                            >
                                {node.icon}
                                {node.nodeName}
                            </li>
                        ),
                )}
                <svg
                    width={width}
                    height="400px"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {lines.map((line, i) => (
                        <path
                            d={line}
                            stroke="#ccc"
                            strokeWidth="1"
                            fill="none"
                            key={i}
                        />
                    ))}
                </svg>
            </ul>
        </div>
    );
};

export default PipeLine;
