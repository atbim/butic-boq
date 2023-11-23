const {
  getHubs,
  getProjects,
  getProjectContents,
  getItemVersions,
  getItemTip,
} = require('../services/aps')

const getHubsFromAdsk = async (req, res, next) => {
  try {
    const hubs = await getHubs(req.internalOAuthToken)
    res.json(hubs)
  } catch (err) {
    next(err)
  }
}

const getProjectsFromAdsk = async (req, res, next) => {
  try {
    const projects = await getProjects(
      req.params.hub_id,
      req.internalOAuthToken
    )
    res.json(projects)
  } catch (err) {
    next(err)
  }
}

const getProjectContentsFromAdsk = async (req, res, next) => {
  try {
    const contents = await getProjectContents(
      req.params.hub_id,
      req.params.project_id,
      req.query.folder_id,
      req.internalOAuthToken
    )
    res.json(contents)
  } catch (err) {
    next(err)
  }
}

const getItemVersionsFromAdsk = async (req, res, next) => {
  try {
    const versions = await getItemVersions(
      req.params.project_id,
      req.params.item_id,
      req.internalOAuthToken
    )
    res.json(versions)
  } catch (err) {
    next(err)
  }
}

const getItemTipFromAdsk = async (req, res, next) => {
  try {
    const version = await getItemTip(
      req.params.project_id,
      req.params.item_id,
      req.internalOAuthToken
    )
    res.json(version.id)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getHubsFromAdsk,
  getProjectsFromAdsk,
  getProjectContentsFromAdsk,
  getItemVersionsFromAdsk,
  getItemTipFromAdsk,
}
