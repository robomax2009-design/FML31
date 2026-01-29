const base = "http://stud.fml31.ru";

(async () => {
  const sid = sessionStorage.getItem("sid");
  if (!sid) {
      alert("No SID found — please login again.");
      window.location.href = "login.html";
      return;
  }
  async function synoRequest(apiPath, params) {
      const url = new URL(`${base}/webapi/${apiPath}`);
      const fullParams = new URLSearchParams({
          ...params,
          _sid: sid
      });
      url.search = fullParams.toString();

      const resp = await fetch(url);
      if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      return data;
  }

  try {
      const listParams = {
          api: "SYNO.FileStation.List",
          version: "1",
          method: "list_share",
          sort_by: "name",
          sort_direction: "ASC"
      };
      const listData = await synoRequest("FileStation/file_share.cgi", listParams);
      console.log("List shares:", listData);

  } catch (err) {
      console.error("Request failed:", err);
      alert("Error during request — check console for details");
  }
  console.log(await getFolder(sid, "/students"));
})();

async function synoRequest(apiPath, params) {
    const url = new URL(`${base}/webapi/${apiPath}`);
    url.search = new URLSearchParams(params).toString();
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
}

async function getFolder(sid, folderPath) {
    const params = {
        api: "SYNO.FileStation.List",
        version: "1",
        method: "list",
        folder_path: folderPath,
        sort_by: "name",
        sort_direction: "ASC",
        _sid: sid
    };
    return await synoRequest("FileStation/file_share.cgi", params);
}

async function listFolder(sid, folderPath) {
    const params = {
        api: "SYNO.FileStation.List",
        version: "1",
        method: "list",
        folder_path: folderPath,
        action: "list",
        offset: 0,
        limit: 1000,
        sort_by: "name",
        sort_direction: "ASC",
        filetype: "all",
        additional: "real_path,size,owner,time,perm,type,mount_point_type,description",
        _sid: sid
    };
    return await synoRequest("FileStation/file_share.cgi", params);
}

async function downloadByPath(sid, synoToken, path) {
    const filename = path.split("/").pop();
    const dlink = Array.from(new TextEncoder().encode(path))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    const params = {
        dlink,
        noCache: Date.now(),
        mode: "download",
        stdhtml: "false",
        _sid: sid,
        SynoToken: synoToken
    };
    const url = `${base}/fbdownload/${filename}?` + new URLSearchParams(params).toString();
    const resp = await fetch(url);
    if (!resp.ok) {
        console.error(`❌ Ошибка ${resp.status}: ${await resp.text()}`);
        return false;
    }
    const blob = await resp.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    return true;
}

async function checkFile(sid, path) {
    const folderPath = path.substring(0, path.lastIndexOf("/"));
    const filename = path.split("/").pop();
    const folderData = await getFolder(sid, folderPath);
    if (!folderData.success) return false;
    const files = folderData.data?.files || [];
    return files.some(f => f.name === filename);
}

async function uploadFile(sid, synoToken, remotePath, file) {
    const folderPath = remotePath.substring(0, remotePath.lastIndexOf("/"));
    const filename = remotePath.split("/").pop();
    const url = `${base}/webman/modules/FileBrowser/webfm/webUI/html5_upload.cgi`;
    const fileSize = file.size;
    const mtime = Date.now();
    const checkParams = {
        api: "SYNO.FileStation.Upload",
        action: "checkfile",
        overwrite: "false",
        filename: filename,
        path: folderPath,
        size: fileSize,
        _sid: sid,
        SynoToken: synoToken
    };
    const checkResp = await fetch(url, {
        method: "POST",
        body: new URLSearchParams(checkParams)
    });
    const checkData = await checkResp.json();
    console.log("Check file:", checkData);
    const uploadParams = {
        api: "SYNO.FileStation.Upload",
        version: "2",
        method: "upload",
        overwrite: "false",
        path: folderPath,
        mtime,
        size: fileSize,
        _sid: sid,
        SynoToken: synoToken
    };
    const formData = new FormData();
    for (const [k, v] of Object.entries(uploadParams)) {
        formData.append(k, v);
    }
    formData.append("file", file, filename);
    const uploadResp = await fetch(url, {
        method: "POST",
        body: formData
    });
    return await uploadResp.json();
}