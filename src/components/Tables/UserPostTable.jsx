// import DropDown from "components/DropDown/DropDown";
import Media from "./Media";
import moment from 'moment';
import NewDropdown from "components/DropDown/DropdownResponsive";
import StatusContainer from "components/StatusContainer";
import { CHANGE_POST_STATUS, SEARCH_POST } from "graphql/mutation";
import { useMutation } from "@apollo/client";
import { useModal } from "hooks/useModal";
import { parse } from 'querystring'
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { AllPostSkeleton } from "components/Skeleton/Skeleton";

const tableHead = ["Location", "Timestamp", "ID", "Caption", "Media", "Like",
    "Comment", "Repost", "Status", "Action"]

const UserPostTable = ({ data, isLoading, ...rest }) => {

    const [postId, setPostId] = useState('');
    const modal = useModal()
    const queryString = useHistory().location.search;
    const username = useHistory().location.pathname.split('/')[2];
    const parseQs = parse(queryString.replace('?', ''));

    const [changePostStatus, { loading }] = useMutation(CHANGE_POST_STATUS, {
        update(cache, { data: newDataMutation }) {
            const { setStatusPost } = newDataMutation;

            modal.actions.onSetSnackbar(setStatusPost.message)

            const { searchPosts } = cache.readQuery({
                query: SEARCH_POST,
                variables: { search: "", location: "", filters: { owner: username } }
            });


            const newHits = searchPosts?.hits?.map((res) => {
                if (res.id === setStatusPost.id) {
                    return {
                        ...res,
                        status: setStatusPost.status
                    }
                }

                return res
            })

            cache.writeQuery({
                query: SEARCH_POST,
                variables: { search: parseQs?.search || '', perPage: 20, page: 0, sortBy: "desc" },
                data: {
                    searchPosts: {
                        ...searchPosts,
                        hits: newHits
                    }
                }
            })
        }, onError(err) {
            modal.actions.onSetSnackbar(err.message)

        }
    })

    const handleChangeStatus = (status, currentPostId) => {
        setPostId(currentPostId)
        changePostStatus({
            variables: {
                active: status === "active" ? true : false,
                flags: [],
                postId: currentPostId,
                takedown: status === "takedown" ? true : false,
                deleted: status === "delete" ? true : false,
            }
        })
    }
    const skeletonLoop = [1, 2, 3, 4, 5]
    return (
        <table className="table-container">
            <tr>
                {tableHead.map((data, idx) => {
                    return <th className={data === 'Location' && 'max-w-xs'}>{data}</th>
                })}
            </tr>
            {isLoading ? (
                skeletonLoop.map((_, key) => <AllPostSkeleton key={key} />)
            ) : (
                data.map((post, idx) => {
                    const createAt = new Date(post.createdAt)
                    const statusPost = post.status
                    const status = statusPost.active
                        ? 'Active'
                        : (statusPost.flag?.length ? 'Flag' : (statusPost.takedown && 'Takedown'))
                    const text = JSON.parse(post.text).markdownContent;
                    return (
                        <tr className="text-center">
                            <td className='max-w-xs'>{post.location.detail.formattedAddress}</td>
                            <td>{moment(createAt).format('DD MMM YYYY hh:mm')}</td>
                            <td>{post.id}</td>
                            <td>{text}</td>
                            <td><Media media={post.media || []} /></td>
                            <td>{post.likeCount}</td>
                            <td>{post.commentCount}</td>
                            <td>{post.repostCount}</td>
                            <td>
                                <div className="flex justify-center items-center mt-2 mb-2">
                                    <StatusContainer>{status}</StatusContainer>
                                </div>
                            </td>
                            <td>
                                <NewDropdown
                                    uniqueId={idx}
                                    options={[
                                        { label: "Active", onClick: () => handleChangeStatus("active", post.id) },
                                        { label: "Take Down", onClick: () => handleChangeStatus("takedown", post.id) },
                                        {
                                            label: "Set Flag", onClick: null, child: [
                                                { label: "Disturbing", onClick: () => handleChangeStatus("Disturbing", post.id) },
                                                { label: "Sensitive", onClick: () => handleChangeStatus("takedown", post.id) },
                                                { label: "Pornography", onClick: () => handleChangeStatus("takedown", post.id) },
                                                { label: "Racist", onClick: () => handleChangeStatus("takedown", post.id) },
                                            ]
                                        },
                                        { label: "See Detail", to: `/all-post/${post.id}` },
                                    ]}
                                />
                            </td>
                        </tr>
                    )
                })
            )}

        </table>
    );
}

export default UserPostTable;