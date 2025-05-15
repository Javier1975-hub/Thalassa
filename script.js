 window.onload = function () {
  const NIDO_HOSTIGADORES = 'nido de hostigadores';
  const ICONO_SAGRADO = 'icono sagrado';
  const PARAPETOS_ABORDAJE = 'parapetos abordaje';
  const PERFILES_ACORAZADOS = 'perfiles acorazados';
  const ARIETE_REFORZADO = 'ariete reforzado';
  const CUBIERTA_PARAPETADA = 'cubierta parapetada';
  const CUBIERTA_MANDO = 'cubierta mando';
  const MAESTRO_KYBERNETES = 'maestro kybernetes';
  const PYROSVESTIS = 'pirosvéstis';
  const MAESTRO_TEKTON = 'maestro tekton';
  const GRUA = 'grúa';
  const ARTEMON = 'artemon';
  const POLYBOLOS = 'polybolos';
  const PYROSTILI = 'pyrostili';
  const BALISTA_ACHINOS = 'balista achinos';
  
      const NIDO_HOSTIGADORES = {
        name:"nido de hostigadores (+3pts/model)",
        cost:3,
        upgrade1:'',
        upgrade2:'',
        upgrade3:ESTRUCTURA
      };
      
      const characterOptions  =[
        {name:'nido de hostigadores',cost:3,upgrade1:'',upgrade2:'',upgrade3:ESTRUCTURA},
      ];
Vue.component('toastr', {
  template:`
    <div :class="displayClasses">
      <div class="toastr-message">
        {{message}}
      </div>
    </div>
  `,
  props: ['message'],
  computed:{
    displayClasses(){
      return this.message == ''
        ? 'toastr'
        : 'toastr toastr-visible'
    }
  }

});
Vue.component('intro-screen',{
  props:[
    'selectedNation',
    'lists',
    'localSaves',
    'savedName',
    'loadArmy',
    'selectNation'
  ],  
  template:`
  <div>
    <select id="Selección de flota" v-bind:value="selectedNation" class="add-unit" v-on:change="$emit('select-nation', $event.target.value)">
      <option value="">Elección de nación</option>
      <option v-for="(value, name) in lists" :value="name" v-bind:key="name">
      {{ name }}
      </option>
    </select>
    <span v-if="localSaves.length">
      or 
      <select id="saveSelect" v-bind:value="savedName" class="add-unit" v-on:change="$emit('load-army', $event.target.value)">
          <option value="">Load a saved army</option>
          <option v-for="(value, index) in localSaves" :value="value" v-bind:key="value">
            {{ value }}
          </option>
      </select>
    </span>
  </div>
  `
})
Vue.component('sharable-link',{
  props: ['sharable','showToastr'],
  methods:{
    copyToClip: function(){
      this.$refs.sharableInput.focus()
      this.$refs.sharableInput.select();
      this.$refs.sharableInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      this.$emit('show-toastr', 'Sharing link copied to clipboard');
    }
  },
  template:
        `<div>
          <h2>Share this list</h2>
          <span class="sharable-link" title="Click to copy sharable link">
            <input v-model="sharable" ref="sharableInput"  v-on:click="copyToClip" />
            <i class="fa fa-link" v-on:click="copyToClip" aria-label="Copy sharable link"></i>
          </span>
        </div>
        `,
});
Vue.component('title-row', {
  template:`
      <div class="unit-row unit-row-title">
          <div class="unit-cell unit-cell-medium" style="margin-left:32px;">
            Troop type 
          </div>
          <div class="unit-cell unit-cell-small">
            MOV.
          </div>
          <div class="unit-cell unit-cell-small">
            MASA
          </div>
          <div class="unit-cell unit-cell-small">
            ESTRUC.
          </div>
          <div class="unit-cell unit-cell-small">
            C.FRONT.
          </div>
          <div class="unit-cell unit-cell-medium">
            C.LAT.
          </div>
          <div class="unit-cell unit-cell-medium">
            C.POST.
          </div>
          <div class="unit-cell unit-cell-medium">
            Traits
          </div>
        </div>
        `
});
Vue.component('unit-row', {
  data:function(){
    return {
      optionToAdd: -1
    }
  },
  props: ['row','index','num-units'],
  computed:{
    optionsCostPerFigure: function() {
      return this.row.selectedOptions.reduce((total,selectedOption) => {
        return total + this.row.options[selectedOption].cost;
      },0);
    },    
    }
  },
  template: `
    <div class="unit-row">
      <div class="row-reposition">
      <button title="Move up" v-if="index != 0" v-on:click="$emit('repos-up',index)" class="unit-up">
        <i class="fa fa-arrow-up"></i>
      </button>
      <button title="Move down" v-if="numUnits -1 != index" v-on:click="$emit('repos-down',index)" class="unit-down">
        <i class="fa fa-arrow-down"></i>
      </button>
      </div>
      <div style="margin-left:32px;">
        <div class="unit-row-stats">
          <div class="unit-cell unit-cell-medium">
            <strong>{{row.displayName}}</strong> ({{row.availability}})
          </div>
          <div class="unit-cell unit-cell-small">
            {{row.combat}}+
          </div>
          <div class="unit-cell unit-cell-small">
            {{row.ranged}}+
          </div>
          <div class="unit-cell unit-cell-small">
            {{row.grit}}+
          </div>
          <div class="unit-cell unit-cell-small">
            {{save}}+
          </div>
          <div class="unit-cell unit-cell-medium">
            {{row.upgradedWeapon ? row.upgradedWeapon : row.defaultWeapon}}
          </div>
          <div class="unit-cell unit-cell-medium">
            {{row.upgradedShield ? row.upgradedShield : row.defaultShield}}
            {{row.upgradedArmour ? row.upgradedArmour : row.defaultBody}}
          </div>
          <div class="unit-cell unit-cell-medium">
            {{row.traits}}
            <span v-if="row.commandPoints">
                , {{row.commandPoints}} command points @ {{row.commandRange}}&quot;
            </span>
          </div>
          <button v-on:click="$emit('remove-unit',index)"  title="Remove unit" class="unit-delete">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="unit-row-stats">
          <div class="unit-cell unit-cell-medium">
            <button v-on:click="removeFigure" title="Remove figure" v-if="row.availability != 'leader'" class="adjust-figure">
              <i class="fa fa-minus"></i>
            </button>
            {{row.size}} figures
            <button v-on:click="addFigure" title="Add figure" v-if="row.availability != 'leader'" class="adjust-figure">
              <i class="fa fa-plus"></i>
            </button>
          </div>
          <div class="unit-cell unit-cell-medium">
            @ {{row.cost}} 
            <span v-if="optionsCostPerFigure > 0">(+{{optionsCostPerFigure}})</span>
            <span v-if="optionsCostPerFigure < 0">({{optionsCostPerFigure}})</span>  
            points each
          </div>
          <div class="unit-cell unit-cell-medium">
            <strong>Total unit cost:  {{row.size * (row.cost + optionsCostPerFigure)}}</strong>
          </div>
        </div>
        <button v-for="(value, index) in row.selectedOptions" v-on:click="removeOption(value)"  class="unit-option-remove">
            <i class="fa fa-times"></i> {{row.options[value].name}}
        </button>
        <select v-if="row.options.length && row.options.length > row.excludedOptions.length"  
              v-model="optionToAdd" v-on:change="addOption(index)" class="unit-option">
          <option value="-1">Add an option</option>
          <option v-for="(value, index) in row.options" v-if="row.excludedOptions.indexOf(index) < 0" 
                    :value="index" v-bind:key="index">
            {{ value.name }}
          </option>
        </select>
      </div>
    </div>`
});
Vue.component('header-section',{
  props:[
    'armyContents',
    'selectedNation',
    'armyName',
    'lists',
    'unitToAdd',
    'armyChanged',
    'reset',
    'saveLocally',
    'deleteLocally',
    'addUnit',
    'updateArmyName'
  ],
  template:
  `
  <div>
    <h2>
      {{selectedNation}} ({{totalCost}} points) ({{totalFiguresCount}} figures in {{armyContents.length}} units)
      <button 
        title="Reset" 
        v-on:click="$emit('reset')" 
        class="top-button">
        <i class="fa fa-undo top-button-icon"></i> Reset
      </button>
      <button 
        title="Save locally" 
        v-on:click="$emit('save-locally')" 
        :disabled="armyChanged" 
        v-bind:class="{ 'top-button': 1, 'top-button-disabled': armyChanged }">
        <i class="fa fa-floppy-o top-button-icon"></i> Save
      </button>
      <button 
        title="Delete army from device" 
        v-on:click="$emit('delete-locally')" 
        :disabled="!armyChanged" 
        v-bind:class="{ 'top-button': 1, 'top-button-disabled': !armyChanged }">
        <i class="fa fa-trash top-button-icon"></i> Delete
      </button>
    </h2>
    <label >
      Army name 
      <input v-bind:value="armyName"
        v-on:keyup="$emit('update-army-name', $event.target.value)" class="army-name" />
    </label>
    <div class="button-bar">
      <select class="add-unit" v-if="selectedNation" v-bind:value="unitToAdd"
        v-on:change="$emit('add-unit', $event.target.value)">
        <option value="">Add a unit</option>
        <option v-for="(value, name) in lists[selectedNation]" :value="name" v-bind:key="name">
          {{ value.displayName }}
   
  computed:{
    totalCost: function(){ 
    	return this.armyContents.reduce((total, unit) => {
        let optionsCost = unit.selectedOptions.reduce((total,selectedOption) => {
          return total + unit.options[selectedOption].cost;
        },0);
      	return total + (unit.size * (unit.cost + optionsCost));
      }, 0);
    },
   

new Vue({
  el: '#app',
  computed:{
    armyChanged: function(){
      return (JSON.stringify(this.armyContents) == JSON.stringify(this.onDiskArmy)) && (this.armyName == this.savedArmyName);      
    },
    sharable: function(){
      let loc = document.location.protocol + '//' + document.location.host + document.location.pathname;
      return loc + '?a=' +  JSON.stringify({sa:this.selectedNation,ac:this.armyContents,an:this.armyName});
    }
  },
  created:function(){
    let objStr = decodeURI(document.location.search);
    if(objStr.substr(0,3) == '?a='){
      objStr = objStr.substr(3);
      let obj = JSON.parse(objStr);
      this.selectedNation = obj.sa;
      this.armyContents = obj.ac;
      this.armyName = obj.an;
    }
    this.localSaves = JSON.parse(localStorage.getItem('armyNames')) || [];
  },
  methods:{
    loadArmy: function(savedName){
      let savedArmies = JSON.parse(localStorage.getItem('armies')) || {};
      let savedArmy = savedArmies[savedName];
      this.selectedNation = savedArmy.selectedNation;
      this.armyContents = JSON.parse(JSON.stringify(savedArmy.armyContents));
      this.onDiskArmy = savedArmy.armyContents;
      this.armyName = savedName;
      this.savedArmyName = savedName;
      this.savedName = '';
    },
    selectNation: function(selectedNation){
      this.selectedNation = selectedNation;
    },
    saveLocally: function(){
      let armyNames = JSON.parse(localStorage.getItem('armyNames')) || [];
      let armies = JSON.parse(localStorage.getItem('armies')) || {};
      if((armyNames.indexOf(this.armyName) > -1 && confirm("Click ok to overwrite!") || armyNames.indexOf(this.armyName) < 0 )){
        if(armyNames.indexOf(this.armyName) < 0){
          armyNames.push(this.armyName);
        }
        armies[this.armyName]={
          selectedNation: this.selectedNation,
          armyContents: this.armyContents
        };
        localStorage.setItem('armyNames',JSON.stringify(armyNames));
        localStorage.setItem('armies',JSON.stringify(armies));
        this.onDiskArmy = JSON.parse(JSON.stringify(this.armyContents))
        this.savedArmyName = this.armyName;
        this.showToastr('Your army has been saved to this device');
      }
    },
    deleteLocally: function(){
      let armyNames = JSON.parse(localStorage.getItem('armyNames')) || [];
      let armies = JSON.parse(localStorage.getItem('armies')) || {};
      armyNames.splice(armyNames.indexOf(this.armyName),1);
      delete armies[this.armyName];
      localStorage.setItem('armyNames',JSON.stringify(armyNames));
      localStorage.setItem('armies',JSON.stringify(armies));
      this.reset();
    },
    showToastr: function(msg){
      clearTimeout(this.toastrTimeout);      
      this.toastrMessage = msg;
      let v = this;
      this.toastrTimeout = setTimeout(function(){
        v.toastrMessage = '';
      },3000);
    },
    addUnit: function(unitToAdd){
     	let newEntry = { ...this.lists[this.selectedNation][unitToAdd] };
      Vue.set(newEntry,'id',Date.now());
     	Vue.set(newEntry,'size' , newEntry.isCharacter ? 1 : 6);
      Vue.set(newEntry,'selectedOptions' , []);
      Vue.set(newEntry,'excludedOptions' , []);
      Vue.set(newEntry,'upgradedArmour' , '');
      Vue.set(newEntry,'upgradedShield' , '');
      Vue.set(newEntry,'upgradedWeapon' , '');
     	this.armyContents.push(newEntry);
      this.unitToAdd = '';
		},
    removeUnit: function(idx){
    	this.armyContents.splice(idx,1);
    },
    reset: function(){
      this.selectedNation = '';
      this.armyContents = [];
      this.armyName = 'Unknown soldiers';
      this.onDiskArmy = '';
      this.savedArmyName = '';
      this.localSaves = JSON.parse(localStorage.getItem('armyNames')) || [];
    },
    reposUp:function(idx){
      let tmp = this.armyContents[idx];
      this.armyContents.splice(idx,1);
      this.armyContents.splice(idx-1,0,tmp);
    },
    reposDown:function(idx){
      let tmp = this.armyContents[idx];
      this.armyContents.splice(idx,1);
      this.armyContents.splice(idx+1,0,tmp);
    },
    updateArmyName: function(armyName){
      this.armyName = armyName;
    }
  },
  data: {
    title: 'Thalassafleetcreator',
    lists: {
      Atenas: {
        Trirreme:{
          isship:true,
          displayName:'Trirreme',
          cost:75,
          options:trirremeOptions,
          movimiento:3,
          masa:6(7),
          estructura:3,
          casco frontal:6,
          casco lateral:6,
          casco posterior: 6,
          salvación del casco: 6+,
          gobernabilidad:3,
          traits:'ariete, slot de proa(1), slot de tripulación(3)'
        },
        Pentecónter:{
          isship:true,
          displayName:'Penteconter',
          cost:40,
          options:penteconterOptions,
          movimiento:3,
          masa:3(4),
          estructura:2,
          casco frontal:5,
          casco lateral:5,
          casco posterior: 5,
          salvación del casco: 7+,
          gobernabilidad:2,
          traits:'ariete, ligera, pequeño, slot de tripulación(1)'
        },
        Barcaza de asedio:{
          isship:true,
          displayName:'Barcaza de asedio',
          cost:30,
          options:barcazaOptions,
          movimiento:3,
          masa:2,
          estructura:3,
          casco frontal:4,
          casco lateral:4,
          casco posterior: 4,
          salvación del casco: 7+,
          gobernabilidad:2,
          traits:'pequeña, máquina de asedio, slot de proa(1) , slot de tripulación(1)'
        },
      }
    },
    selectedNation:'',
    armyContents:[],
    onDiskArmy:[],
    savedArmyName:[],
    unitToAdd:'',
    armyName:'Unknown soldiers',
    localSaves:[],
    savedName:'',
    toastrMessage:'',
    toastrTimeout:0
  }
})
    } 
</script>
</head>
<body>
<script src="https://unpkg.com/vue">
</script>
</body>
</html>
}
