<!-- <form method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
  <a href="/Details">Upload</a>
</form> -->

<script>
  import { onMount } from 'svelte';
  import { read,utils } from 'xlsx';
  import axios from "axios";
import { PUBLIC_WEBHOOK_URL, PUBLIC_ACCESS_TOKEN } from "$env/static/public";

  let files;
  let fileData = [];
//   let recordIDs=["b8e502a9e34f470daa2209de667a6bdb"];
  let recordIDs=[];
  let worker;
  let uploading=false;
  let deleting=false;

  let confDialog;
	let currentDate = new Date();
	onMount( () => {
		confDialog = document.getElementById('confirmation-dialog');
	})
  const showConfDialogClick = () => {
			confDialog['showModal']();
	};
	const closeConfClick = () => {
		confDialog.close();
	};
  async function handleFileUpload(event) {
    uploading=true;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        fileData = utils.sheet_to_json(sheet, { header: 1 });
        console.log(fileData)
        let index = fileData[0].indexOf("RECORDID");
        console.log(index)
        let i=1;
        while(fileData[i]!=null)
        {
          if(fileData[i].length>0)
          {
            let temp=fileData[i]
            console.log(temp[index])
            recordIDs.push(temp[index])
            i++;
          }
          else{
            break;
          }
        }
        uploading=false;
      };
      
      reader.readAsArrayBuffer(file);
    }
  }

  async function deleteRecording(){
    deleting=true;
    const body={
      "reason":"audit"
    }
    const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PUBLIC_ACCESS_TOKEN}`,
          };
        Promise.all(recordIDs.map(recordID => {
          return axios.delete(`${PUBLIC_WEBHOOK_URL}/${recordID}`,  { data: body, headers: headers})
        })).then(e=>console.log("successfully deleted"))
        .then(r=>{
           showConfDialogClick()
          deleting=false;
          files=null;
        })
        .catch(error=>console.log("Error during deleting recordings"+error))
        

  }
</script>


<!-- <div>
  <input type="file" accept=".xlsx" on:change={handleFileUpload} />
</div> -->

<section class="hero custom-color is-small">
  <div class="hero-body">
    <h1>Delete Recordings</h1>
  </div>
</section>
<div class="container section has-text-centered mt-6 pt-6">
  <div class="columns is-centered is-multiline is-desktop is-3">
    <div class="section column is-full">
      <h3 class="title">Upload Your Excel File</h3>
    </div>
    <hr />
    <div class="column is-one-fifth file has-name is-info is-boxed">
      <label class="file-label">
        <input accept=".xlsx" bind:files class="file-input" type="file" name="resume" on:change={handleFileUpload}>
        <span class="file-cta">
          <span class="file-icon">
            <i class="fa-solid fa-cloud-arrow-up"></i>
          </span>
          <span class="file-label">
            Choose a file…
          </span>
        </span>
        <span class="file-name">
          {#if files}
          {#each Array.from(files) as file}
            <p>{file.name}</p>
          {/each}
          {:else}
            No File Chosen
          {/if}
        </span>
      </label>
    </div>
  </div>
  <div class="columns is-centered is-multiline is-desktop is-3">
    <div class="section column is-half">
      {#if uploading}
      <button class="button is-rounded is-responsive is-normal is-fullwidth custom-red" disabled>
            <span class="icon">
              <i class="fa-solid fa-spinner fa-spin"></i>
            </span>
            <span>Uploading</span>
        </button>
        {:else if deleting}
          <button class="button is-rounded is-responsive is-normal is-fullwidth custom-red" disabled>
            <span class="icon">
              <i class="fa-solid fa-spinner fa-spin"></i>
            </span>
            <span>Deleting</span>
        </button>
        {:else if files}
        <button class="button is-rounded is-responsive is-normal is-fullwidth custom-red" on:click={deleteRecording}>
            <span class="icon">
              <i class="fa-solid fa-trash-can"></i>
            </span>
            <span>Delete Recordings</span>
        </button>
        {:else}
        <button class="button is-rounded is-responsive is-normal is-fullwidth custom-red" disabled>
            <span class="icon">
              <i class="fa-solid fa-trash-can"></i>
            </span>
            <span>Delete Recordings</span>
        </button>
        {/if}
    </div>
  </div>
  <dialog id="confirmation-dialog">
		<div class="content">
      <hr/>
			<h3>
				All your recordings mentioned in the excel file are now deleted!
			</h3>
      <hr/>
			<button class="button is-danger is-outlined is-rounded" on:click={closeConfClick}>Close</button>
		</div>
	</dialog>
</div>


<style lang="scss" global>
   .custom-primary {
  background-color: #00bcf5;
  color: white;
}
.custom-red{
    background-color: #ff3a65;
    color: white;
}
.custom-color{
  background: linear-gradient(45deg, #00bcf5,  #82cf5f);
      animation: gradientAnimation 5s ease infinite;
}
@keyframes gradientAnimation {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
h1{
  font-size: 40px;
  margin-top: 40px;
  text-align: center;
}
dialog {
		border-radius: 10px;
		width: 50%;
		transition: all 2s;
		background-color: white;
	}
	dialog::backdrop {
		background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7));
		animation: fade-in 1s;
	}
</style>