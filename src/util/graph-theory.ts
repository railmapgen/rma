/**
 * This is a subset of src/redux/helper/graph-theory-util.ts in railmapgen/rmg
 * and is directly copied from the source code.
 */

import { StationDict } from '../constants/rmg';

/**
 * Getter of all routes (行車交路) of the line (both ends included). The first branch must be the main line.
 * @example MTREastRailLine.branches
 * /*
 * [0]: [LineStart, Lo Wu, Sheung Shui, ..., Hung Hom, LineEnd]
 * [1]: [LineStart, Lok Ma Chau, Sheung Shui, ..., Hung Hom, LineEnd]
 * [2]: [LineStart, Lo Wu, Sheung Shui, ..., University, Racecourse, Sha Tin, ..., Hung Hom, LineEnd]
 * [3]: [LineStart, Lok Ma Chau, Sheung Shui, ..., University, Racecourse, Sha Tin, ..., Hung Hom, LineEnd]
 * /
 */
export const getRoutes = (stnList: StationDict) => {
    const stack = ['linestart'];
    const branches = [['linestart']];
    let branchCount = 0;

    while (stack.length) {
        let curId = stack.shift() as string;
        let prevId = branches[branchCount].slice(-1)[0] || null;
        if (prevId && curId !== 'linestart') {
            branches[branchCount].push(curId);
        } else {
            branches[branchCount] = [curId];
        }
        while (curId !== 'lineend') {
            prevId = curId;
            const children = stnList[prevId].children;
            switch (children.length) {
                case 1:
                    curId = children[0];
                    break;
                case 2: {
                    const rightBranchInfo = stnList[prevId].branch!.right!;
                    const branchNextId = rightBranchInfo[1];
                    // if (branchCount === 0) {
                    if (rightBranchInfo[0] === 'through') {
                        branches.push(branches[branchCount].slice());
                        stack.push(branchNextId);
                    } else {
                        if (branchCount === 0) {
                            branches.push([prevId]);
                            stack.push(branchNextId);
                        }
                        // branches.push([prevId]);
                    }
                    // stack.push(branchNextId);
                    // }
                    curId = children.filter(stnId => stnId !== branchNextId)[0];
                    break;
                }
            }
            branches[branchCount].push(curId);

            if (prevId === stnList[curId].branch?.left?.[1] && stnList[curId].branch?.left?.[0] === 'nonthrough') {
                break;
            }
        }
        // branches[branchCount] = curBranch;
        branchCount++;
    }

    return branches;
};
