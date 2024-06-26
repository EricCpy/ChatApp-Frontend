import React from 'react'
import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { resetGet, createForum, reset, updateForum } from '../../../features/forumManagement/forumManagementSlice';

function ForumThreadWidget(props) {
    const [input, setInput] = useState({});

    const dispatch = useDispatch();
    let { isPending, isError, isSuccess, message } = useSelector((state) => state.forumManagement);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (props.forum) {
            dispatch(updateForum({ token: props.token, forumID: props.forum._id, updateData: input }));
        } else {
            dispatch(createForum({ token: props.token, forum: input }));
        }
    }

    const close = () => {
        props.hide(false);
        dispatch(reset());
    }

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
        if (isSuccess) {
            console.log("Created: ");
            console.log(message);
            dispatch(resetGet());
            dispatch(reset());
            props.hide(false);
        }
    }, [props, isError, isSuccess, message, dispatch])

    return (
        <div>
            <Modal show={props.show ? true : false} onHide={() => close()}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-black">{props.forum ? "Forum Editor" : "Forum Creator"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label className="text-black">Forum name*</Form.Label>
                            <Form.Control id="ForumThreadNameInput" type="text"
                                placeholder={props.forum ? props.forum.name : 'name'}
                                defaultValue={props.forum ? props.forum.name : ''}
                                name="name"
                                onChange={(e) => setInput({ ...input, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label className="text-black">Description</Form.Label>
                            <Form.Control id="ForumThreadDescriptionInput" as="textarea" rows={5}
                                placeholder={props.forum ? props.forum.description : 'description'}
                                defaultValue={props.forum ? props.forum.description : ''}
                                name="description"
                                onChange={(e) => setInput({ ...input, description: e.target.value })} />
                        </Form.Group>

                        <Form.Group className="d-flex flex-row justify-content-between mx-2">
                            <Button id={props.forum ? "SaveForumThreadButton" : "CreateForumThreadButton"} variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
                                {isPending ? (<><span className="spinner-border spinner-border-sm" role="status"></span>
                                    {props.forum ? 'Updating' : 'Creating new'} forum...</>) : (<>Submit forum</>)}
                            </Button>
                            <Button variant="secondary" id={props.forum ? "CancelEditForumThreadButton" : "CancelCreateForumThreadButton"} onClick={() => close()}>
                                Back to List
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="text-black">
                    {isError ? <p className="me-auto text-danger">Bitte fülle alle Pflichtfelder aus!</p> : <></>}
                    *Pflichfelder
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ForumThreadWidget