import { Recipe, RecipeServiceProvider } from './../../providers/recipe-service/recipe-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-recipe-form',
    templateUrl: 'recipe-form.html',
})
export class RecipeFormPage {
    // Allowed ranges, with step
    public readonly COFFEE_WEIGHT_RANGE = [10, 32, 2];
    public readonly TEMPERATURE_RANGE_F = [85, 97, 1];
    public readonly TDS_RANGE = [800, 1600, 50];
    public readonly BREW_TIME_RANGE = [1, 3, 1];
    public readonly CUP_SIZE_RANGE = [250, 350, 50];

    // LED colors for recipes stored on the machine
    public readonly RECIPE_SLOT_COLORS = ['red', 'green', 'blue', 'cyan']
    public addRecipeForm: FormGroup;
    public recipe: Recipe;

    private messages = {
        'MAIN.ERROR': '',
        'MAIN.OK': '',
        'RECIPES.NEW_RECIPE_SAVED': ''
    };

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private formBuilder: FormBuilder,
        private toastCtrl: ToastController,
        private recipeService: RecipeServiceProvider,
        private translateService: TranslateService) {

        this.translate();


        // Get the recipe for edit
        // If new create a new, properly intializes recipe object
        let recipeId = navParams.get('id');
        if (recipeId) {
            this.recipe = this.recipeService.getRecipe(recipeId);
        } else {
            this.recipe = new Recipe();
            this.recipe.cupSize = this.CUP_SIZE_RANGE[0];
            this.recipe.coffeeQuantity = this.COFFEE_WEIGHT_RANGE[0];
            this.recipe.temperature = this.TEMPERATURE_RANGE_F[0];
            this.recipe.tds = this.TDS_RANGE[0];
            this.recipe.brewDuration = this.BREW_TIME_RANGE[0];
        }

        // Setup the form
        this.addRecipeForm = this.formBuilder.group({
            name: [this.recipe.name, Validators.required],
            cupSize: [this.recipe.cupSize, Validators.required],
            coffeeQuantity: [this.recipe.coffeeQuantity, Validators.required],
            temperature: [this.recipe.temperature, Validators.required],
            tds: [this.recipe.tds, Validators.required],
            brewDuration: [this.recipe.brewDuration, Validators.required]
        });

    }


    private translate() {
        for (let messageId in this.messages) {
            this.translateService.get(messageId).subscribe(res => {
                this.messages[messageId] = res;
            });
        }
    }

    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'events-toast',
            position: 'middle',
            duration: 5000
        });
        toast.present();
    }


    public submit() {
        console.log(this.addRecipeForm);
        for (let key of Object.keys(this.addRecipeForm.controls)) {
            this.recipe[key] = this.addRecipeForm.controls[key].value;
        }
        this.recipeService.storeRecipe(this.recipe);
        this.showToast(this.messages['RECIPES.NEW_RECIPE_SAVED']);
        this.navCtrl.pop();
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad RecipeFormPage');
    }

}
