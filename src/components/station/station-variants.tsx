import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stage } from '../../constants/constants';
import { StnID } from '../../constants/rmg';
import { useRootDispatch, useRootSelector } from '../../redux';
import { setCurrentStage, setCurrentStationID, setShowDefaultVariants } from '../../redux/runtime/runtime-slice';

export default function StationAgGrid() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { project } = useRootSelector(state => state.param);
    const { metadata } = project;
    const { currentStationID: selectedStationID } = useRootSelector(state => state.runtime);

    const [rowData, setRowData] = useState<{ [k in StnID]: string }>({});
    useEffect(() => {
        const rowData = Object.fromEntries([
            ['default', t('stationVariants.baseVariant')],
            ...Object.entries(metadata).map(([id, { name }]) => [id, name]),
        ]);
        setRowData(rowData);
    }, [metadata]);
    console.log(rowData);

    const handleSelectionChanged = (selectedStationID: StnID) => {
        if (selectedStationID === 'default') {
            dispatch(setShowDefaultVariants(true));
        } else {
            dispatch(setShowDefaultVariants(false));
            dispatch(setCurrentStationID(selectedStationID));
            const availableStage = Object.keys(project.stations[selectedStationID]).at(1) as Stage | undefined;
            dispatch(setCurrentStage(availableStage ?? Stage.Departure));
        }
    };

    return (
        <TableContainer height="100%" overflowY="auto">
            <Table variant="simple" height="100%">
                <Thead>
                    <Tr>
                        <Th>{t('stationVariants.title')}</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.entries(rowData).map(([id, name]) => (
                        <Tr
                            key={id}
                            bg={id === selectedStationID ? 'teal.100' : 'transparent'}
                            _hover={{ bg: 'gray.100' }}
                            onClick={() => handleSelectionChanged(id as StnID)}
                        >
                            <Td>{name}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
