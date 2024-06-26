import React from 'react'
import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getForums } from '../../../features/forumManagement/forumManagementSlice';
import forumPic from "../../../layout/pictures/forum.png";
import ConfirmationDialog from './ConfirmationDialog';
import ForumThreadWidget from './ForumThreadWidget';

function ForumThreadPage(props) {
  const [createDialog, setCreateDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [started, setStarted] = useState(false);

  let { forums, isGetPending, isGetError, isGetSuccess } = useSelector((state) => state.forumManagement);
  const dispatch = useDispatch();

  useEffect(() => {
    if (started === false) {
      setStarted(true);
      dispatch(getForums())
      return;
    }
    if (!(isGetError || isGetSuccess)) {
      dispatch(getForums());
      return;
    }
    if (isGetError) {
      console.log("error");
      return;
    }
    if (isGetSuccess) {
      console.log("success");
      return;
    }

  }, [started, isGetError, isGetSuccess, dispatch])

  return (
    <div className="container-fluid">
      <div className="row row row-cols-1 row-cols-lg-3">
        <div className="col mb-2 mb-lg-0 order-1 order-lg-0 d-flex flex-column justify-content-center">
          <div className="d-flex flex-row justify-content-lg-start justify-content-center">
            <button className="btn btn-primary" id="OpenCreateForumThreadDialogButton" onClick={() => setCreateDialog(true)}>
              Create Forum
            </button>
          </div>
        </div>
        <div className="col order-first order-lg-1 text-white text-center">
          <h1>Forums</h1>
        </div>
        <div className="col order-last d-flex flex-column justify-content-center">
          <div className="input-group d-flex flex-row justify-content-lg-end justify-content-center">
            <div className="search">
              <input type="search" id="search" className="form-control" placeholder="Search.." />
            </div>
            <div className="input-group-append">
              <Dropdown as={ButtonGroup} >
                <Dropdown.Toggle variant='outline-secondary' />
                <Dropdown.Menu>
                  <Dropdown.Item>byID</Dropdown.Item>
                  <Dropdown.Item>byName</Dropdown.Item>
                  <Dropdown.Item>byOwnerID</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <button type="button" className="btn btn-outline-secondary"><i
                className="bi bi-search"></i></button>
            </div>
          </div>
        </div>
      </div>
      {isGetPending ? <div><span className="spinner-border spinner-border-sm" role="status"></span>Collecting forums...</div> :
        <div id="ForumThreadList" className="row row-cols-1 row-cols-md-2 row-cols-xl-3 mt-3">
          {forums.map(item => {
            return (
              <div className="col forumThread" id={`ForumThread${item._id}`} key={item._id}>
                <div className="card text-white">
                  <div className="card-body">
                    <img className="card-img-top" src={forumPic} alt="Card cap" />
                    <h5 className="card-title">{item.name.length > 75 ? item.name.substring(0, 75) + "..." : item.name}</h5>
                    <p className="card-text">{item.description ? (item.description.length > 100 ? item.description.substring(0, 100) + "..." : item.description) : item.description}</p>
                    <div className="d-flex justify-content-between">
                      <Link to={item._id} id={`ViewForumThreadButton${item._id}`} className="btn btn-primary" state={{forum: item}}>
                        <p>Visit Forum</p>
                      </Link>

                      <div>
                        {(props.user.userID === item.ownerID || props.user.isAdministrator === true) ?
                          <>
                            <button className="btn btn-secondary" id={`EditForumThreadButton${item._id}`} onClick={() => setUpdateDialog(item)}>
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button className="btn btn-danger ms-1" id={`DeleteForumThreadButton${item._id}`} onClick={() => setConfirmationDialog(item)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </>
                          : <></>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
      {createDialog ? <ForumThreadWidget show={createDialog} hide={setCreateDialog} token={props.token} /> : <></>}
      {updateDialog ? <ForumThreadWidget show={updateDialog} hide={setUpdateDialog} token={props.token} forum={updateDialog} /> : <></>}
      {confirmationDialog ? <ConfirmationDialog show={confirmationDialog} hide={setConfirmationDialog} token={props.token} forum={confirmationDialog} /> : <></>}
    </div>
  )
}

export default ForumThreadPage;