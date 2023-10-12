<!-- <form method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
  <a href="/Details">Upload</a>
</form> -->

<script>
  import { onMount } from 'svelte';
  import { read,utils } from 'xlsx';
  import axios from "axios";
import { PUBLIC_WEBHOOK_URL, PUBLIC_ACCESS_TOKEN , PUBLIC_ADMIN_URL} from "$env/static/public";

  let files;
  let recordings=[]
  let deleting=false;
  let expanded = [];
  let confDialog;
  let selectedrec=[]
	onMount( () => {
		confDialog = document.getElementById('confirmation-dialog');
        const body={"max":100}
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PUBLIC_ACCESS_TOKEN}`,
          };
        axios.get(`${PUBLIC_ADMIN_URL}?max=100`, { headers: headers})
        .then((r)=>{
            console.log(r.data.items)
            recordings=r.data.items
        })
	})
  const showConfDialogClick = () => {
			confDialog['showModal']();
	};
	const closeConfClick = () => {
		confDialog.close();
	};

  async function deleteRecording(){
    deleting=true;
    const body={
      "reason":"audit"
    }
    const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PUBLIC_ACCESS_TOKEN}`,
          };
        Promise.all(selectedrec.map(recordID => {
            console.log(recordID)
          return axios.delete(`${PUBLIC_WEBHOOK_URL}/${recordID}`,  { data: body, headers: headers})
        })).then(e=>console.log("successfully deleted"))
        .then(r=>{
           showConfDialogClick()
          deleting=false;
          selectedrec=[]
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
<div class="container section  mt-6 pt-6">
  <div class="columns  is-multiline is-desktop is-3">
    <div class="section column is-full">
      <h3 class="title">Select Your Recordings</h3>
    </div>
    <hr />
    {#if recordings.length>0}
    {#each recordings as recording,i}
    <div class="column is-full">
        <div class="columns  is-multiline is-desktop is-3">
            <div class="column is-four-fifths">
                <label class="checkbox" >
                    <input type="checkbox" bind:group={selectedrec} value={recording.id}>
                    {recording.topic}
                    
                </label>
            </div>
                <h4 on:click={()=>expanded[i]=!expanded[i]}>
                    {#if expanded[i]}
                    <button class="button is-link is-light">Show Less</button>
                    {:else}
                    <button class="button is-link is-light">Show More</button>
                    {/if}
                </h4>
                {#if expanded[i]}
                    <div class="section column ">
                        {JSON.stringify(recording, null, "\t")}
                        </div>
                {/if}
        </div>
    </div>
    {/each}
    {:else}
    <div class="column is-full">
      <h3 class="subtitle" style="margin-left:40px;">Sorry there are no recordings to delete</h3>
    </div>
    {/if}
  </div>
  <div class="columns is-centered is-multiline is-desktop is-3">
    <div class="section column is-half">
        {#if deleting}
          <button class="button is-rounded is-responsive is-normal is-fullwidth custom-red" disabled>
            <span class="icon">
              <i class="fa-solid fa-spinner fa-spin"></i>
            </span>
            <span>Deleting</span>
        </button>
        {:else if selectedrec.length>0}
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
    .checkbox{
        margin-left: 80px;;
    }
</style>