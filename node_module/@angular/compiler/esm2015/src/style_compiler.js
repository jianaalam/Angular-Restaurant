/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileStylesheetMetadata, identifierModuleUrl, identifierName } from './compile_metadata';
import { ViewEncapsulation } from './core';
import * as o from './output/output_ast';
import { ShadowCss } from './shadow_css';
const COMPONENT_VARIABLE = '%COMP%';
export const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
export const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
export class StylesCompileDependency {
    constructor(name, moduleUrl, setValue) {
        this.name = name;
        this.moduleUrl = moduleUrl;
        this.setValue = setValue;
    }
}
export class CompiledStylesheet {
    constructor(outputCtx, stylesVar, dependencies, isShimmed, meta) {
        this.outputCtx = outputCtx;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
        this.isShimmed = isShimmed;
        this.meta = meta;
    }
}
export class StyleCompiler {
    constructor(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new ShadowCss();
    }
    compileComponent(outputCtx, comp) {
        const template = comp.template;
        return this._compileStyles(outputCtx, comp, new CompileStylesheetMetadata({
            styles: template.styles,
            styleUrls: template.styleUrls,
            moduleUrl: identifierModuleUrl(comp.type)
        }), this.needsStyleShim(comp), true);
    }
    compileStyles(outputCtx, comp, stylesheet, shim = this.needsStyleShim(comp)) {
        return this._compileStyles(outputCtx, comp, stylesheet, shim, false);
    }
    needsStyleShim(comp) {
        return comp.template.encapsulation === ViewEncapsulation.Emulated;
    }
    _compileStyles(outputCtx, comp, stylesheet, shim, isComponentStylesheet) {
        const styleExpressions = stylesheet.styles.map(plainStyle => o.literal(this._shimIfNeeded(plainStyle, shim)));
        const dependencies = [];
        stylesheet.styleUrls.forEach((styleUrl) => {
            const exprIndex = styleExpressions.length;
            // Note: This placeholder will be filled later.
            styleExpressions.push(null);
            dependencies.push(new StylesCompileDependency(getStylesVarName(null), styleUrl, (value) => styleExpressions[exprIndex] = outputCtx.importExpr(value)));
        });
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        const stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
        const stmt = o.variable(stylesVar)
            .set(o.literalArr(styleExpressions, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])))
            .toDeclStmt(null, isComponentStylesheet ? [o.StmtModifier.Final] : [
            o.StmtModifier.Final, o.StmtModifier.Exported
        ]);
        outputCtx.statements.push(stmt);
        return new CompiledStylesheet(outputCtx, stylesVar, dependencies, shim, stylesheet);
    }
    _shimIfNeeded(style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    }
}
function getStylesVarName(component) {
    let result = `styles`;
    if (component) {
        result += `_${identifierName(component.type)}`;
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvc3R5bGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFzRCx5QkFBeUIsRUFBRSxtQkFBbUIsRUFBRSxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN2SixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDekMsT0FBTyxLQUFLLENBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBSXZDLE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxXQUFXLGtCQUFrQixFQUFFLENBQUM7QUFDekQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLGNBQWMsa0JBQWtCLEVBQUUsQ0FBQztBQUUvRCxNQUFNLE9BQU8sdUJBQXVCO0lBQ2xDLFlBQ1csSUFBWSxFQUFTLFNBQWlCLEVBQVMsUUFBOEI7UUFBN0UsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFzQjtJQUFHLENBQUM7Q0FDN0Y7QUFFRCxNQUFNLE9BQU8sa0JBQWtCO0lBQzdCLFlBQ1csU0FBd0IsRUFBUyxTQUFpQixFQUNsRCxZQUF1QyxFQUFTLFNBQWtCLEVBQ2xFLElBQStCO1FBRi9CLGNBQVMsR0FBVCxTQUFTLENBQWU7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2xELGlCQUFZLEdBQVosWUFBWSxDQUEyQjtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVM7UUFDbEUsU0FBSSxHQUFKLElBQUksQ0FBMkI7SUFBRyxDQUFDO0NBQy9DO0FBRUQsTUFBTSxPQUFPLGFBQWE7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Q0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVPLGFBQWEsQ0FBQyxLQUFhLEVBQUUsSUFBYTtRQUNoRCxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3BGLENBQUM7Q0FDRjtBQUVELFNBQVMsZ0JBQWdCLENBQUMsU0FBd0M7SUFDaEUsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ3RCLElBQUksU0FBUyxFQUFFO1FBQ2IsTUFBTSxJQUFJLElBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0tBQ2hEO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSwgQ29tcGlsZVN0eWxlc2hlZXRNZXRhZGF0YSwgaWRlbnRpZmllck1vZHVsZVVybCwgaWRlbnRpZmllck5hbWV9IGZyb20gJy4vY29tcGlsZV9tZXRhZGF0YSc7XG5pbXBvcnQge1ZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICcuL2NvcmUnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7U2hhZG93Q3NzfSBmcm9tICcuL3NoYWRvd19jc3MnO1xuaW1wb3J0IHtVcmxSZXNvbHZlcn0gZnJvbSAnLi91cmxfcmVzb2x2ZXInO1xuaW1wb3J0IHtPdXRwdXRDb250ZXh0fSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBDT01QT05FTlRfVkFSSUFCTEUgPSAnJUNPTVAlJztcbmV4cG9ydCBjb25zdCBIT1NUX0FUVFIgPSBgX25naG9zdC0ke0NPTVBPTkVOVF9WQVJJQUJMRX1gO1xuZXhwb3J0IGNvbnN0IENPTlRFTlRfQVRUUiA9IGBfbmdjb250ZW50LSR7Q09NUE9ORU5UX1ZBUklBQkxFfWA7XG5cbmV4cG9ydCBjbGFzcyBTdHlsZXNDb21waWxlRGVwZW5kZW5jeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIG1vZHVsZVVybDogc3RyaW5nLCBwdWJsaWMgc2V0VmFsdWU6ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcGlsZWRTdHlsZXNoZWV0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgb3V0cHV0Q3R4OiBPdXRwdXRDb250ZXh0LCBwdWJsaWMgc3R5bGVzVmFyOiBzdHJpbmcsXG4gICAgICBwdWJsaWMgZGVwZW5kZW5jaWVzOiBTdHlsZXNDb21waWxlRGVwZW5kZW5jeVtdLCBwdWJsaWMgaXNTaGltbWVkOiBib29sZWFuLFxuICAgICAgcHVibGljIG1ldGE6IENvbXBpbGVTdHlsZXNoZWV0TWV0YWRhdGEpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBTdHlsZUNvbXBpbGVyIHtcbiAgcHJpdmF0ZSBfc2hhZG93Q3NzOiBTaGFkb3dDc3MgPSBuZXcgU2hhZG93Q3NzKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdXJsUmVzb2x2ZXI6IFVybFJlc29sdmVyKSB7fVxuXG4gIGNvbXBpbGVDb21wb25lbnQob3V0cHV0Q3R4OiBPdXRwdXRDb250ZXh0LCBjb21wOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOiBDb21waWxlZFN0eWxlc2hlZXQge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gY29tcC50ZW1wbGF0ZSAhO1xuICAgIHJldHVybiB0aGlzLl9jb21waWxlU3R5bGVzKFxuICAgICAgICBvdXRwdXRDdHgsIGNvbXAsIG5ldyBDb21waWxlU3R5bGVzaGVldE1ldGFkYXRhKHtcbiAgICAgICAgICBzdHlsZXM6IHRlbXBsYXRlLnN0eWxlcyxcbiAgICAgICAgICBzdHlsZVVybHM6IHRlbXBsYXRlLnN0eWxlVXJscyxcbiAgICAgICAgICBtb2R1bGVVcmw6IGlkZW50aWZpZXJNb2R1bGVVcmwoY29tcC50eXBlKVxuICAgICAgICB9KSxcbiAgICAgICAgdGhpcy5uZWVkc1N0eWxlU2hpbShjb21wKSwgdHJ1ZSk7XG4gIH1cblxuICBjb21waWxlU3R5bGVzKFxuICAgICAgb3V0cHV0Q3R4OiBPdXRwdXRDb250ZXh0LCBjb21wOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICBzdHlsZXNoZWV0OiBDb21waWxlU3R5bGVzaGVldE1ldGFkYXRhLFxuICAgICAgc2hpbTogYm9vbGVhbiA9IHRoaXMubmVlZHNTdHlsZVNoaW0oY29tcCkpOiBDb21waWxlZFN0eWxlc2hlZXQge1xuICAgIHJldHVybiB0aGlzLl9jb21waWxlU3R5bGVzKG91dHB1dEN0eCwgY29tcCwgc3R5bGVzaGVldCwgc2hpbSwgZmFsc2UpO1xuICB9XG5cbiAgbmVlZHNTdHlsZVNoaW0oY29tcDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvbXAudGVtcGxhdGUgIS5lbmNhcHN1bGF0aW9uID09PSBWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZDtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbXBpbGVTdHlsZXMoXG4gICAgICBvdXRwdXRDdHg6IE91dHB1dENvbnRleHQsIGNvbXA6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgIHN0eWxlc2hlZXQ6IENvbXBpbGVTdHlsZXNoZWV0TWV0YWRhdGEsIHNoaW06IGJvb2xlYW4sXG4gICAgICBpc0NvbXBvbmVudFN0eWxlc2hlZXQ6IGJvb2xlYW4pOiBDb21waWxlZFN0eWxlc2hlZXQge1xuICAgIGNvbnN0IHN0eWxlRXhwcmVzc2lvbnM6IG8uRXhwcmVzc2lvbltdID1cbiAgICAgICAgc3R5bGVzaGVldC5zdHlsZXMubWFwKHBsYWluU3R5bGUgPT4gby5saXRlcmFsKHRoaXMuX3NoaW1JZk5lZWRlZChwbGFpblN0eWxlLCBzaGltKSkpO1xuICAgIGNvbnN0IGRlcGVuZGVuY2llczogU3R5bGVzQ29tcGlsZURlcGVuZGVuY3lbXSA9IFtdO1xuICAgIHN0eWxlc2hlZXQuc3R5bGVVcmxzLmZvckVhY2goKHN0eWxlVXJsKSA9PiB7XG4gICAgICBjb25zdCBleHBySW5kZXggPSBzdHlsZUV4cHJlc3Npb25zLmxlbmd0aDtcbiAgICAgIC8vIE5vdGU6IFRoaXMgcGxhY2Vob2xkZXIgd2lsbCBiZSBmaWxsZWQgbGF0ZXIuXG4gICAgICBzdHlsZUV4cHJlc3Npb25zLnB1c2gobnVsbCEpO1xuICAgICAgZGVwZW5kZW5jaWVzLnB1c2gobmV3IFN0eWxlc0NvbXBpbGVEZXBlbmRlbmN5KFxuICAgICAgICAgIGdldFN0eWxlc1Zhck5hbWUobnVsbCksIHN0eWxlVXJsLFxuICAgICAgICAgICh2YWx1ZSkgPT4gc3R5bGVFeHByZXNzaW9uc1tleHBySW5kZXhdID0gb3V0cHV0Q3R4LmltcG9ydEV4cHIodmFsdWUpKSk7XG4gICAgfSk7XG4gICAgLy8gc3R5bGVzIHZhcmlhYmxlIGNvbnRhaW5zIHBsYWluIHN0cmluZ3MgYW5kIGFycmF5cyBvZiBvdGhlciBzdHlsZXMgYXJyYXlzIChyZWN1cnNpdmUpLFxuICAgIC8vIHNvIHdlIHNldCBpdHMgdHlwZSB0byBkeW5hbWljLlxuICAgIGNvbnN0IHN0eWxlc1ZhciA9IGdldFN0eWxlc1Zhck5hbWUoaXNDb21wb25lbnRTdHlsZXNoZWV0ID8gY29tcCA6IG51bGwpO1xuICAgIGNvbnN0IHN0bXQgPSBvLnZhcmlhYmxlKHN0eWxlc1ZhcilcbiAgICAgICAgICAgICAgICAgICAgIC5zZXQoby5saXRlcmFsQXJyKFxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlRXhwcmVzc2lvbnMsIG5ldyBvLkFycmF5VHlwZShvLkRZTkFNSUNfVFlQRSwgW28uVHlwZU1vZGlmaWVyLkNvbnN0XSkpKVxuICAgICAgICAgICAgICAgICAgICAgLnRvRGVjbFN0bXQobnVsbCwgaXNDb21wb25lbnRTdHlsZXNoZWV0ID8gW28uU3RtdE1vZGlmaWVyLkZpbmFsXSA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgby5TdG10TW9kaWZpZXIuRmluYWwsIG8uU3RtdE1vZGlmaWVyLkV4cG9ydGVkXG4gICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICBvdXRwdXRDdHguc3RhdGVtZW50cy5wdXNoKHN0bXQpO1xuICAgIHJldHVybiBuZXcgQ29tcGlsZWRTdHlsZXNoZWV0KG91dHB1dEN0eCwgc3R5bGVzVmFyLCBkZXBlbmRlbmNpZXMsIHNoaW0sIHN0eWxlc2hlZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2hpbUlmTmVlZGVkKHN0eWxlOiBzdHJpbmcsIHNoaW06IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIHJldHVybiBzaGltID8gdGhpcy5fc2hhZG93Q3NzLnNoaW1Dc3NUZXh0KHN0eWxlLCBDT05URU5UX0FUVFIsIEhPU1RfQVRUUikgOiBzdHlsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTdHlsZXNWYXJOYW1lKGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhfG51bGwpOiBzdHJpbmcge1xuICBsZXQgcmVzdWx0ID0gYHN0eWxlc2A7XG4gIGlmIChjb21wb25lbnQpIHtcbiAgICByZXN1bHQgKz0gYF8ke2lkZW50aWZpZXJOYW1lKGNvbXBvbmVudC50eXBlKX1gO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=