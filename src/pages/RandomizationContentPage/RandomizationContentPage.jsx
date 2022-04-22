import { useLazyQuery } from '@apollo/client';
import { get } from 'lodash'
import { ChevronLeftIcon } from "@heroicons/react/solid";
import Table from "components/Tables";
import { useHistory } from "react-router-dom";
import { GET_THEMES } from "graphql/query";
import { useEffect, useMemo } from 'react';

const RandomizationContentPage = () => {
    const history = useHistory()
    let path = history.location.pathname.split('/')[2]


    const [
        searchTheme,
        { data, refetch: onSearchRefetch, loading, called }
    ] = useLazyQuery(GET_THEMES, { fetchPolicy: 'no-cache' })

    // const { data, loading } = useQuery(GET_THEMES, { variables: { name: path }, fetchPolicy : 'no-cache' })
    // const searchThemes = get(data, 'searchThemes', [])[0]

    useEffect(() => {

        if (called) {
            onSearchRefetch({ name: path })

            return;
        }
        searchTheme({ variables: { name: path } });
    }, [path])

    // const adjective = searchThemes?.adjective.map(adj => ({ name: adj })) || []
    const handleClick = () => history.goBack()

    const colors = useMemo(
        () => get(data, 'searchThemes[0].colors') || [],
        [data]
    )
    const adjective = get(data, 'searchThemes[0].adjective') || []
    const nouns = get(data, 'searchThemes[0].nouns') || []
    const id = get(data, 'searchThemes[0].id') || []
    //   const { searchThemes: searchThemeData } = data
    return (
        <div>
            <div className="flex items-center p-2">
                <ChevronLeftIcon onClick={handleClick} className="w-6 h-6 cursor-pointer" />
                <h1>{path}</h1>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <Table noAddNew noPagination onRefetch={onSearchRefetch} type="Randomization" isLoading={loading} headerName="Colors" data={colors} id={id} noSearch noExport noFilter noSort />
                <Table noAddNew noPagination onRefetch={onSearchRefetch} type="Randomization" isLoading={loading} headerName="Adjective" data={adjective} id={id} noSearch noExport noFilter noSort />
                <Table noAddNew noPagination onRefetch={onSearchRefetch} type="Randomization" isLoading={loading} headerName="Nouns" data={nouns} id={id} noSearch noExport noFilter noSort />
            </div>
        </div>
    );
}

export default RandomizationContentPage;