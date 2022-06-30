export interface IProps {
    list:INode[]
}
export interface IHash {
    [key: string]: any;
}

export interface IconnectorNode {
    nodeId: string;
}

export interface INode {
    connectorNodeList: {
        next: IconnectorNode[];
        pre: IconnectorNode[];
    };
    level?: number;
    index?: number;
    status: number;
    total?: number;
    nodeName: string;
    nodeId: string;
    nodeType: string;
    taskData?: IHash | null;
    [key: string]: any;
}

export interface IHashNode {
    [key: string]: INode;
}

export interface IRes {
    nodes: INode[][];
    msg: string;
}
