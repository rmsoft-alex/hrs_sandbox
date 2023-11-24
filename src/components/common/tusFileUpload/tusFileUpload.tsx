"use client";
import React, { useState } from "react";
import { Upload } from "tus-js-client";
interface Props {
  src: string;
}

const FileUpload = (props: Props) => {
  const [progressPercent, setProgressPercent] = useState(0); //tus onProgress진행시 저장하는 percent
  const onFileChange = (e: any) => {
    var file = e.target.files[0];
    const upload = new Upload(file, {
      endpoint: `${props.src}`, //clive studio에서 쓰던 tus api : http://dev-rm-seoul.iptime.org:33011/editor/v1/api/tus/file/upload
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: function (error) {
        //업로드시 error가 발생했을때 쓰는 옵션
        console.log("Failed because: " + error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        //업로드가 진행중일때 쓰는 옵션
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        setProgressPercent(Number(percentage));
        console.log(bytesUploaded, bytesTotal, percentage + "%");
      },
      onAfterResponse: (req, res) => {
        // 업로드 중 응답 콜백 -> 백에서 코드응답오는 부분
        console.log("onAfterResponse req>", req); //실행순서3
        console.log("onAfterResponse res>", res); //실행순서4
      },
      onSuccess: function () {
        //성공일때 옵션
        console.log("Download %s from %s", file.name); //실행순서5
      },
    });

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // 업로드할 파일 업로드전 확인가능한곳
      // ex)파일명, 파일사이즈, 파일확장명확인해서 조건 통과하는부분에 upload.start()만 해주면 upload성공

      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
        console.log(
          "previousUpload>",
          upload.resumeFromPreviousUpload(previousUploads[0])
        ); //실행순서1
      }

      // Start the upload
      upload.start();
    });
  };
  return (
    <div className="text-center text-2xl p-6">
      <input type="file" name="file" id="" onChange={onFileChange} />
      <div className="flex flex-col justify-center items-center">
        <h2>진행중</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: progressPercent + "%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
