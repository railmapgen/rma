import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { RmgSelect } from '@railmapgen/rmg-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stage } from '../../constants/constants';
import { StnID } from '../../constants/rmg';
import { useRootDispatch, useRootSelector } from '../../redux';
import { setCurrentStage, setCurrentStationID, setShowDefaultVariants } from '../../redux/runtime/runtime-slice';

export default function StationAgGrid() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const {
        project: { metadata },
    } = useRootSelector(state => state.param);
    const { showDefaultVariants, currentStationID: selectedStationID } = useRootSelector(state => state.runtime);

    const [rowData, setRowData] = useState<{ [k in StnID]: string }>({});
    useEffect(() => {
        const rowData = Object.fromEntries([
            ['default', t('Base Variant')],
            ...Object.entries(metadata).map(([id, { name }]) => [id, name]),
        ]);
        setRowData(rowData);
    }, [metadata]);

    const handleSelectionChanged = (selectedStationID: StnID) => {
        if (selectedStationID === 'default') {
            dispatch(setShowDefaultVariants(true));
        } else {
            dispatch(setShowDefaultVariants(false));
            dispatch(setCurrentStationID(selectedStationID));
            dispatch(setCurrentStage(Stage.Departure));
        }
    };

    const _ = (
        <RmgSelect
            value={showDefaultVariants ? 'default' : selectedStationID}
            options={rowData}
            onChange={({ target: { value } }) => handleSelectionChanged(value)}
        />
    );

    return (
        <TableContainer height="100%" overflowY="auto">
            <Table variant="simple" height="100%">
                <Thead>
                    <Tr>
                        <Th>{t('Station Variants')}</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.entries(rowData).map(([id, name]) => (
                        <Tr key={id} onClick={() => handleSelectionChanged(id as StnID)}>
                            <Td>{name}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
